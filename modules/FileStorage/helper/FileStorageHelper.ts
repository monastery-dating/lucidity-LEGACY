import { SignalsType } from '../../context.type'
import { ActionContextType } from '../../context.type'

declare var require: any

let doProjectChanged = ( doc ) => {}
let doSceneChanged = ( doc ) => {}

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

  ipcRenderer.on ( 'error', ( event, message ) => {
    signals.$status.changed ( { status: { type: 'error',  message } } )
  })

  ipcRenderer.on ( 'file-changed', ( event, { path, op, source } ) => {
    signals.$filestorage.file ( { path, op, source } )
  })

  ipcRenderer.on ( 'library-changed', ( event, { path, op, source } ) => {
    signals.$filestorage.library ( { path, op, source } )
  })

  doProjectChanged = ( doc ) => {
    ipcRenderer.send ( 'project-changed', doc )
  }

  doSceneChanged = ( doc ) => {
    ipcRenderer.send ( 'scene-changed', doc )
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
