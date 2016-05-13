export const update =
( { state, input, output } ) => {

  if ( input.deleted ) {
    // FIXME: Handle removal
  }
  else {
    const doc = input.doc
    const { _id, type } = doc

    state.set ( [ 'data', type, _id ], doc )

    const cid = state.get ( [ type, '_id' ] )

    if ( _id === cid ) {
      output ( { saved: type } )
    }
  }
}
