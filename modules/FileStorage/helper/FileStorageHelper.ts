import { ComponentType, ComponentByIdType } from '../../Graph'
import { SignalsType } from '../../context.type'
import { ActionContextType } from '../../context.type'
import { PreferencesType } from './types'

declare var require: any

type PathResolve = string | boolean

let doProjectChanged = ( doc: ComponentType ) => {}
let doSceneChanged = ( doc: ComponentType ) => {}
let doLoadProject = ( project, scenes, path ) => {}
let doLoadLibrary = ( state, path ) => {}
let doSelectProjectPath = ( doc?: ComponentType ): Promise<PathResolve> =>
{ return Promise.resolve ( false ) }
let savePrefs = ( prefs: PreferencesType ) => {}
let prefs: PreferencesType

let doSelectLibraryPath = (): Promise<PathResolve> =>
{ return Promise.resolve ( false ) }

let projectPathSelected = ( path: string ) => {}
let libraryPathSelected = ( path: string ) => {}

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

  const { ipcRenderer } = require ( 'electron' )

  // =========== GET PREFERENCES (SYNC)
  prefs = ipcRenderer.sendSync ( 'preferences' )
  if ( ! prefs ) {
    // disable all filesystem stuff
    return
  }

  savePrefs = ( prefs ) => {
    ipcRenderer.send ( 'preferences', prefs )
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

  ipcRenderer.on ( 'project-path-selected', ( event, path ) => {
    projectPathSelected ( path )
  })

  ipcRenderer.on ( 'library-path-selected', ( event, path ) => {
    libraryPathSelected ( path )
  })

  // FIXME: HACK
  ipcRenderer.send
  ( 'selected-project',  '/Users/gaspard/git/lucidity.project/Girls.lucy' )

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
      projectPathSelected = resolve
      ipcRenderer.send ( 'select-project-path' )
    })
    return p
  }

  doSelectLibraryPath = () => {
    const path = prefs.libraryPath
    if ( path ) {
      return Promise.resolve ( path )
    }
    const p = new Promise<PathResolve> ( ( resolve, reject ) => {
      libraryPathSelected = resolve
      ipcRenderer.send ( 'select-library-path' )
    })
    return p
  }

  doLoadProject = ( project, scenes, path ) => {
    // path can be null if the user does not want to sync
    setTimeout ( () => changedSignal ( { type: 'active' } ), 0 )
    ipcRenderer.send ( 'load-project', project, scenes, path )
  }

  doLoadLibrary = ( state, path ) => {
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
  return doSelectProjectPath ( doc )
}

// Async get library path with dialog
export const selectLibraryPath =
(): Promise<PathResolve> => {
  return doSelectLibraryPath ()
}

export const loadProject =
( project: ComponentType
, scenes: ComponentType[]
, path: string | boolean
) => {
  if ( typeof path === 'string' ) {
    prefs.projectPaths [ project._id ] = path
    savePrefs ( prefs )
  }
  doLoadProject ( project, scenes, path )
}

export const loadLibrary =
( state
, path: string | boolean
) => {
  if ( typeof path === 'string' ) {
    prefs.libraryPath = path
    savePrefs ( prefs )
  }
  doLoadLibrary ( state, path )
}
