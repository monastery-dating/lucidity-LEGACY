import { ContextType } from '../../context.type'
import * as check from 'check-types'

export const save =
( { state
  , input: { doc, docs }
  , services: { data: { db } }
  , output
  } : ContextType
) => {

  if ( doc ) {
    // setTimeout ( () => {
    db.put
    ( doc
    , ( err ) => {
        if ( err ) {
          output.error
          ( { status: { type: 'error', message: err } } )
        }
        else {
          output.success
          ( { status: { type: 'success', message: `Saved ${doc.type}` } } )
        }
      }
    )
    // }, 500 )
  }

  else if ( docs ) {
    db.bulkDocs
    ( docs
    , ( err ) => {
        if ( err ) {
          output.error
          ( { status: { type: 'error', message: err } } )
        }
        else {
          output.success
          ( { status:
              { type: 'success'
              , message: `Saved ${docs [ 0 ].type}`
              }
            }
          )
        }
      }
    )
  }
  else {
    throw 'Missing "docs" or "doc" in Data.save'
  }

}

save [ 'async' ] = true

// Cerebral type checking
const mdoc = { _id: 'string', type: 'string' }
save [ 'input' ] = ( v ) => {
  return check.maybe.like ( v.doc, mdoc )
      && check.maybe.array.of.like ( v.docs, mdoc )
}
