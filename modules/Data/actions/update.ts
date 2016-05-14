export const update =
( { state, input: { change }, output } ) => {

  if ( change.deleted ) {
    // FIXME: Handle removal
  }
  else {
    const doc = change.doc
    const { _id, type } = doc

    state.set ( [ 'data', type, _id ], doc )

    const cid = state.get ( [ type, '_id' ] )

    if ( _id === cid || cid === undefined ) {
      output ( { saved: type } )
    }
  }
}
