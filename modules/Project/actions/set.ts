export default
( { state
  , input: { title }
  , output
  }
) => {
  const oldTitle =
  state.get ( [ 'project', 'title' ] )

  state.set ( [ 'project', '$editing' ], false )

  if ( oldTitle !== title ) {
    let _id = state.get ( [ 'data', 'main', 'projectId', 'value' ] )
    let _rev
    if ( !_id ) {
      // new project
      _id = new Date().toISOString ()
    }
    else {
      _rev = state.get ( [ 'data', 'project', _id, '_rev' ] )
    }

    state.set ( [ 'project', '$saving' ], true )

    // A. Two-way sync around /data
    //   * monkey will copy title to project/title
    //   * data observer will save and remove $saving flag
    // state.set ( [ 'data', 'project', id, 'title' ], title )

    // B. Two-way sync, writes go to DB
    //   * writes go to DB ( but then they are async )
    //   * HERE UI can be confusing: visible state rollback to old title
    //     * ==> Use $title while saving ? ( monkey should know about this )
    //   * DB on.change ==> data
    //   * data => monkey => project/title
    state.set ( [ 'project', '$title' ], title )
    output.success ( { _id, _rev, type: 'project', title } )
  }
}
