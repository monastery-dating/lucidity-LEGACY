import { Db } from '../types/db.type'

const action = ( { services, output } ) => {
  const db: Db = services.data.db
  const data = {}
  db.allDocs
  ( { include_docs: true, descending: true }
  , ( err, docs ) => {
      if ( err ) {
        output.error ( { type: 'error', message: err } )
      }
      else {

        for ( const mdoc of docs.rows ) {
          const doc = mdoc.doc
          let types = data [ doc.type ]
          if ( !types ) {
            types = {}
            data [ doc.type ] = types
          }
          types [ doc._id ] = doc
        }

        output.success ( { data: data, path: 'data' } )
      }
    }
  )
}

action [ 'async' ] = true
export default action
