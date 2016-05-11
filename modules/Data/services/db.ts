import * as PouchDB from 'pouchdb'

const db = new PouchDB ( 'lucidity' )
/*
  db.destroy ( ( err ) => {
      if ( err ) {
        console.log ( err )
      }
    }
  )
*/
export default db
