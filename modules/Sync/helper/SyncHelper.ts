import { SignalsType } from '../../context.type'
// FIXME: we should probably move all db code
// to a DatabaseHelper and use this to login, sync, etc
// with proper try/catch/promise.
//
// CHECK CODE WITH
// https://github.com/colinskow/ng-pouch-mirror/blob/master/src/ng-pouch-mirror.js
import * as PouchDB from 'pouchdb'

let sync
let remoteDB

const DB_NAME = 'lucidity-dev'
const HOST = 'db.lucidity.io'
const PROT = 'https'
const PORT = 6984

export module SyncHelper {
  export const start =
  ( { controller, db } ) => {
    console.log ( 'START SYNC' )

    const signals: SignalsType = controller.getSignals ()

    const changedSignal = signals.$sync.changed

    if ( sync ) {
      stop ()
    }

    if ( !remoteDB ) {
      // This never throws
      remoteDB = new PouchDB
      ( `${PROT}://${HOST}:${PORT}/${DB_NAME}`
        , { skipSetup: true }
      )
    }

    const login = ( retry ) => {
      try {
        remoteDB.login ( 'gaspard', 'devdoompasshopi' )
        .then ( () => {
          changedSignal ( { type: 'paused' } )
          startSync ( { db, remoteDB, changedSignal, retry } )
        })

        .catch ( ( err ) => {
          // invalid credentials or offlinne ?
          stop ()
          changedSignal ( { type: 'offline' } )
          if ( retry ) {
            retry ()
          }
        })

      }

      catch ( err ) {
        stop ()
        changedSignal ( { type: 'offline' } )
        if ( retry ) {
          retry ()
        }
      }
    }

    const retry = () => {
      setTimeout
      ( () => login ( retry )
      , 5000
      )
    }
    login ( retry )


    remoteDB
    .on ( 'error', ( err ) => {
        changedSignal ( { type: 'error', message: err } )
      }
    )

  }

  export const stop =
  () => {
    if ( sync ) {
      sync.cancel ()
      sync = null
    }
  }

  const startSync =
  ( { db, remoteDB, changedSignal, retry } ) => {
    sync = db.sync
    ( remoteDB, { live: true, retry: false } )
    .on ( 'change', () => {
      changedSignal ( { type: 'change' } )
    })
    .on ( 'paused', () => {
      changedSignal ( { type: 'paused' } )
    })
    .on ( 'active', () => {
      changedSignal ( { type: 'active' } )
    })
    .on ( 'complete', () => {
      changedSignal ( { type: 'complete' } )
    })
    .on ( 'error', ( err ) => {
      // going offline
      changedSignal ( { type: 'offline' } )
      if ( retry ) {
        retry ()
      }
    })
  }

}
