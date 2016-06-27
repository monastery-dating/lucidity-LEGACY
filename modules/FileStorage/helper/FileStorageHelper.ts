import { SignalsType } from '../../context.type'
import { ActionContextType } from '../../context.type'

declare var require: any

let doProjectChanged = ( doc ) => {}

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

  ipcRenderer.on ( 'file-changed', ( event, { path, op, source } ) => {
    signals.$filestorage.file ( { path, op, source } )
  })

  ipcRenderer.on ( 'library-changed', ( event, { path, op, source } ) => {
    signals.$filestorage.library ( { path, op, source } )
  })

  doProjectChanged = ( doc ) => {
    ipcRenderer.send ( 'project-changed', doc )
  }

  setTimeout ( () => changedSignal ( { type: 'on' } ), 0 )
}

// Notify main process when a project changes (not a scene).
export const projectChanged =
( { state
  , input: { doc }
  , output
  } : ActionContextType
) => {
  doProjectChanged ( doc )
}
projectChanged [ 'async' ] = false
