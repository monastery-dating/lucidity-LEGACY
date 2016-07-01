import { ComponentType, ComponentByIdType } from '../../Graph'
import { SignalsType } from '../../context.type'
import { ActionContextType } from '../../context.type'
import { PreferencesType } from './types'
import { getDirectory } from './FileDialog'
import { preferences } from './Preferences'


declare var require: any

type PathResolve = string | boolean

let doProjectChanged = ( doc: ComponentType ) => {}
let doSceneChanged = ( doc: ComponentType ) => {}
let doLoadProject = ( path, project, scenes ) => {}
let doLoadLibrary = ( path, state ) => {}
let doSelectProjectPath = ( doc?: ComponentType ): Promise<PathResolve> =>
{ return Promise.resolve ( false ) }
let savePrefs = ( prefs: PreferencesType ) => {}
let prefs: PreferencesType

let doSelectLibraryPath = (): Promise<PathResolve> =>
{ return Promise.resolve ( false ) }

let doSelectPath = ( path: string ) => { console.log ( path ) }

// This helper runs on the renderer side of the app.
// FileStorageMain runs on the main process (node.js).
export const start =
( { controller } ) => {

  const signals: SignalsType = controller.getSignals ()
  const changedSignal = signals.$filestorage.changed

  if ( !window [ 'process' ] ) {
    // browser: no FS sync
    setTimeout ( () => changedSignal ( { type: 'offline' } ), 0 )
    return
  }

  // ========= REPLACE ALL THIS IPC STUFF WITH MESSAGES TO fsworker ==
  const callbacks: any = {}

  const fork = require ( 'child_process' ).fork
  // this is executed in app/build
  const fsworker = fork ( 'app/build/fsworker.js' )

  fsworker.on ( 'close', ( code ) => {
    console.log ( `fsworker exited with code ${code}` )
  })

  fsworker.on ( 'message', ( args ) => {
    const type = args.shift ()
    const clbk = callbacks [ type ]
    if ( clbk ) {
      clbk ( null, ...args )
    }
  })

  const ipcRenderer =
  { on ( type, clbk ) {
      callbacks [ type ] = clbk
    }
  , send ( ...args ) {
      fsworker.send ( args )
    }
  }

  // =========== GET PREFERENCES (SYNC)
  try {
    prefs = preferences ( null )
  }
  catch ( err ) {
    // not sending a signal in a signal
    setTimeout ( () => changedSignal ( { type: 'error', message: err } ) )
  }
  if ( ! prefs ) {
    // disable all filesystem stuff
    return
  }

  savePrefs = ( prefs ) => {
    preferences ( prefs )
  }

  // =========== RECEIVE FILE SYSTEM NOTIFICATIONS

  ipcRenderer.on ( 'done', ( event ) => {
    setTimeout ( () => {
      changedSignal ( { type: 'paused' } )
    }, 100)
  })

  ipcRenderer.on ( 'error', ( event, message ) => {
    changedSignal ( { type: 'error', message } )
  })

  ipcRenderer.on ( 'file-changed', ( event, msg ) => {
    signals.$filestorage.file ( msg )
  })

  ipcRenderer.on ( 'library-changed', ( event, msg ) => {
    signals.$filestorage.library ( msg )
  })

  // =========== NOTIFY FILE SYSTEM

  doProjectChanged = ( doc ) => {
    ipcRenderer.send ( 'project-changed', doc )
  }

  doSceneChanged = ( doc ) => {
    ipcRenderer.send ( 'scene-changed', doc )
  }

  doSelectProjectPath = ( doc?: ComponentType ) => {
    if ( doc ) {
      const path = prefs.projectPaths [ doc._id ]
      if ( path ) {
        return Promise.resolve ( path )
      }
    }
    const p = new Promise<PathResolve> ( ( resolve, reject ) => {
      getDirectory ( 'Please select project directory.', resolve )
    })
    return p
  }

  doSelectLibraryPath = () => {
    const path = prefs.libraryPath
    if ( path ) {
      return Promise.resolve ( path )
    }
    const p = new Promise<PathResolve> ( ( resolve, reject ) => {
      getDirectory ( 'Please select library directory.', resolve )
    })
    return p
  }

  doLoadProject = ( path, project, scenes ) => {
    // path can be null if the user does not want to sync
    setTimeout ( () => changedSignal ( { type: 'active' } ), 0 )
    ipcRenderer.send ( 'load-project', path, project, scenes )
  }

  doLoadLibrary = ( path, state ) => {
    // path can be null if the user does not want to sync
    setTimeout ( () => changedSignal ( { type: 'active' } ), 0 )
    // Prepare path
    ipcRenderer.send ( 'load-library', path )
    if ( path ) {
      const components: ComponentByIdType = state.get ( [ 'data', 'component' ] )
      let list: ComponentType[] = []
      for ( const k in components ) {
        list.push ( components [ k ] )
        if ( list.length === 10 ) {
          ipcRenderer.send ( 'load-components', list )
          list = []
        }
      }
      if ( list.length > 0 ) {
        ipcRenderer.send ( 'load-components', list )
      }
      // mark end of compents loading
      ipcRenderer.send ( 'load-components', null )
    }
  }

  setTimeout ( () => changedSignal ( { type: 'paused' } ), 0 )
}

// Notify main process when a project changes (not a scene).
export const docChanged =
( { state
  , input: { docs, doc }
  , output
  } : ActionContextType
) => {
  const list = docs || [ doc ]
  let haschange = false
  for ( const d of list ) {
    if ( d ) {
      if ( d.type === 'scene' ) {
        if ( !haschange ) {
          state.set ( [ '$filestorage', 'status' ], 'active' )
          haschange = true
        }
        doSceneChanged ( d )
      }
      else if ( d.type === 'project' ) {
        if ( !haschange ) {
          state.set ( [ '$filestorage', 'status' ], 'active' )
          haschange = true
        }
        doProjectChanged ( d )
      }
    }
  }
}
docChanged [ 'async' ] = false

// Async get project path with dialog
export const selectProjectPath =
( doc?: ComponentType ): Promise<PathResolve> => {
  const p = doSelectProjectPath ( doc )
  return p
}

// Async get library path with dialog
export const selectLibraryPath =
(): Promise<PathResolve> => {
  return doSelectLibraryPath ()
}

export const loadProject =
( path: string | boolean
, project: ComponentType
, scenes: ComponentType[]
) => {
  if ( typeof path === 'string' ) {
    prefs.projectPaths [ project._id ] = path
    savePrefs ( prefs )
  }
  doLoadProject ( path, project, scenes )
}

export const loadLibrary =
( path: string | boolean
, state
) => {
  if ( typeof path === 'string' ) {
    prefs.libraryPath = path
    savePrefs ( prefs )
  }
  doLoadLibrary ( path, state )
}
