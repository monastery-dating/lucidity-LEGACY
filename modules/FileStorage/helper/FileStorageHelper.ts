import { SignalsType } from '../../context.type'

declare var require: any

let sync
let remoteFS

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

  const { ipc } = require ( 'electron' )

  ipc.on ( 'source-changed', ( event, { path, op, source } ) => {
    signals.$filestorage.source ( { path, op, source } )
  })

  ipc.on ( 'library-changed', ( event, { path, op, source } ) => {
    signals.$filestorage.library ( { path, op, source } )
  })

  setTimeout ( () => changedSignal ( { type: 'on' } ), 0 )
}
