export default
( { state
  , input: { title }
  , output
  }
) => {
  const oldTitle =
  state.get ( [ 'project', 'title' ] )

  state.set ( [ '$project', 'editing' ], false )

  if ( oldTitle !== title ) {
    let _id = state.get ( [ 'project', '_id' ] )
    let _rev
    if ( !_id ) {
      // new project
      _id = new Date().toISOString ()
    }
    else {
      _rev = state.get ( [ 'data', 'project', _id, '_rev' ] )
    }

    state.set ( [ '$project', 'saving' ], true )

    state.set ( [ '$project', 'title' ], title )
    output.success ( { _id, _rev, type: 'project', title } )
  }
}
