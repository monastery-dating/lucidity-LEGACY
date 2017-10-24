import { ActionContextType } from '../../context.type'

const getVerb = ( doc ) => (
  doc._deleted ?
  'Deleted'
  : ( doc._rev ? 'Updated' : 'New' )
)

// Could be removed: no need for so much operation noise or have something
// more interesting...
const getStatus = ( doc ) => (
  { type: 'info', message: `${ getVerb ( doc )} ${doc.type} '${doc.name || ''}'` }
)

export const update =
( { state, input, output }: ActionContextType ) => {
  const doc = input.doc || input.change.doc
  const { _id, type } = doc

  const status = type === 'main' ? undefined : getStatus ( doc )
  let saved

  const cid = state.get ( [ type, '_id' ] )

  if ( doc._deleted ) {
    state.unset ( [ 'data', type, _id ] )
    if ( _id === cid ) {
      state.unset ( [ type ] )
      // should load a new item in place
    }
  }
  else {
    state.set ( [ 'data', type, _id ], doc )

    if ( _id === cid || cid === undefined ) {
      saved = type
    }
  }
  output ( { saved, status, doc } )
}
