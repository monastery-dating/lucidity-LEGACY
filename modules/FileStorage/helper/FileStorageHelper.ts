import { SignalsType } from '../../context.type'

let sync
let remoteFS

// This helper runs on the renderer side of the app.
// FileStorageMain runs on the main process (node.js).
export const start =
( { controller } ) => {
  console.log ( 'START FS SYNC' )

  const signals: SignalsType = controller.getSignals ()

  const changedSignal = signals.$filestorage.changed

  if ( sync ) {
    stop ()
  }

  if ( !remoteFS ) {
    // This never throws
  }

/*
  remoteFS
  .on ( 'error', ( err ) => {
      changedSignal ( { type: 'error', message: err } )
    }
  )
  */
  setTimeout
  ( () => changedSignal ( { type: 'on' } )
  , 0
  )

}

export const stop =
() => {
  if ( sync ) {
    sync.cancel ()
    sync = null
  }
}
