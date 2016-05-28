import * as PouchDB from 'pouchdb'
import * as PouchDBAuthentication from 'pouchdb-authentication'

const DB_NAME = 'lucidity-dev'
const HOST = 'localhost'
//const HOST = 'db.lucidity.io'
const PROT = 'http'
const PORT = 5984

// https://github.com/nolanlawson/pouchdb-authentication
PouchDB.plugin ( PouchDBAuthentication )

const remoteDB = new PouchDB
( `${PROT}://${HOST}:${PORT}/${DB_NAME}`
, { skipSetup: true }
)

remoteDB.login ( 'gaspard', 'devdoompasshopi' )
.then ( () => console.log ( 'login OK' ))
.catch ( (err) => console.log ( err ) )

export const db = new PouchDB ( 'lucidity' )

export const sync = db.sync ( remoteDB, { live: true, retry: true } )
// THESE .on are for testing.
// TODO: register signals so that we can propagate sync state to the UI.
.on ( 'paused', () => console.log ( 'sync paused' ) )
.on ( 'active', () => console.log ( 'sync active' ) )
.on ( 'complete', () => console.log ( 'sync complete' ) )
.on ( 'error', console.log.bind ( console ) )
/*
*/

export module authdb {
  export const signup = ( username, password, opts ) => {
    return remoteDB.signup ( username, password, opts )
  }
  export const login = ( username, password ) => {
    // FIXME: return a new promise and start sync
    // on success.
    return remoteDB.login ( username, password )
  }
  export const logout = () => {
    //sync.cancel ()
    return remoteDB.logout ()
  }
}


/*
  db.destroy ( ( err ) => {
      if ( err ) {
        console.log ( err )
      }
    }
  )
*/
