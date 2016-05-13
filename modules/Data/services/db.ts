import * as PouchDB from 'pouchdb'

export const db =
new PouchDB ( 'lucidity' )
/*
  db.destroy ( ( err ) => {
      if ( err ) {
        console.log ( err )
      }
    }
  )
*/
