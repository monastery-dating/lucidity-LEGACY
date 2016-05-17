import { ContextType } from '../../context.type'
import * as check from 'check-types'

export const save =
( { state
  , input //: { doc, docs }
  , services: { data: { db } }
  , output
  } : ContextType
) => {
  const { doc, docs } = input

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
const checkDoc = ( doc ) => {
  return check.string ( doc._id )
      && check.string ( doc.type )
}

save [ 'input' ] = ( value ) => {
  if ( value.doc ) {
    return checkDoc ( value.doc )
  }
  else if ( value.docs ) {
    return value.docs.reduce
    ( ( acc, doc ) => acc && checkDoc ( doc )
    , true
    )
  }
  else {
    return false
  }
}
/*
Could we fix with check ?
save [ 'input' ] =
{ doc: ( v ) => check.maybe.like ( v, mdoc )
, docs: ( v ) => check.maybe.array.of.like ( v, mdoc )
}
*/
