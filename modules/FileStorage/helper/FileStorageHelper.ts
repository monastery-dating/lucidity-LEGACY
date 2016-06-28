import { ComponentType } from '../../Graph'
import { SignalsType } from '../../context.type'
import { ActionContextType } from '../../context.type'
import { DocLoad } from './types'

declare var require: any

type PathResolve = string | boolean

let doProjectChanged = ( doc: ComponentType ) => {}
let doSceneChanged = ( doc: ComponentType ) => {}
let doLoadProject = ( doc: ComponentType, path: string | boolean ) => {}
let doSelectProjectPath = ( doc?: ComponentType ): Promise<PathResolve> =>
{ return Promise.resolve ( false ) }

let projectPathSelected = ( path: string ) => {}

// This helper runs on the renderer side of the app.
// FileStorageMain runs on the main process (node.js).
export const start =
( { controller } ) => {
  console.log ( 'START FS SYNC' )

  const signals: SignalsType = controller.getSignals ()
  const changedSignal = signals.$filestorage.changed

  if ( !window [ 'process' ] ) {
    // browser: no FS sync
    setTimeout ( () => changedSignal ( { type: 'offline' } ), 0 )
    return
  }

  const { ipcRenderer } = require ( 'electron' )

  // =========== RECEIVE FILE SYSTEM NOTIFICATIONS

  ipcRenderer.on ( 'error', ( event, message ) => {
    signals.$status.changed ( { status: { type: 'error',  message } } )
  })

  ipcRenderer.on ( 'file-changed', ( event, msg ) => {
    signals.$filestorage.file ( msg )
  })

  ipcRenderer.on ( 'doc-load', ( event, data: DocLoad ) => {
    signals.$filestorage.doc ( data )
  })

  ipcRenderer.on ( 'library-changed', ( event, { path, op, source } ) => {
    signals.$filestorage.library ( { path, op, source } )
  })

  ipcRenderer.on ( 'project-path-selected', ( event, path ) => {
    projectPathSelected ( path )
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
      const path = getProjectPath ( doc._id )
      if ( path ) {
        loadProject ( doc, path )
        return Promise.resolve ( path )
      }
    }
    const p = new Promise<PathResolve> ( ( resolve, reject ) => {
      projectPathSelected = resolve
      ipcRenderer.send ( 'select-project-path' )
    })
    return p
  }

  doLoadProject = ( doc, path ) => {
    // path can be null if the user does not want to sync
    ipcRenderer.send ( 'load-project', doc, path )
  }

  setTimeout ( () => changedSignal ( { type: 'on' } ), 0 )
}

// Notify main process when a project changes (not a scene).
export const docChanged =
( { state
  , input: { docs, doc }
  , output
  } : ActionContextType
) => {
  const list = docs || [ doc ]
  for ( const d of list ) {
    if ( d ) {
      if ( d.type === 'scene' ) {
        doSceneChanged ( d )
      }
      else if ( d.type === 'project' ) {
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

// FIXME: This should be stored in the user's file system
// something like .lucidity (a JSON file)
const prefs: any = { projectPaths: {} }

const setProjectPath =
( _id: string
, path: string
) => {
  prefs.projectPaths [ _id ] = path
}

const getProjectPath =
( _id: string
): string => {
  return prefs.projectPaths [ _id ]
}

export const loadProject =
( doc: ComponentType
, path: string | boolean
) => {
  prefs.projectPaths [ doc._id ] = path
  doLoadProject ( doc, path )
}
