export const finishEditing =
( { state
  , input: { path, value }
  , output
  }
) => {
  const oldValue = state.get ( path )
  const root = path.slice ( 0, path.length - 1 )

  state.set ( [ '$factory', 'editing' ], false )

  if ( oldValue !== value ) {
    const doc = Object.assign ( {}, state.get ( root ) )
    const key = path [ path.length - 1 ]
    doc [ key ] = value

    if ( !doc._id ) {
      // new element
      doc._id = new Date().toISOString ()
      doc.type = root [ 0 ]
    }

    state.set ( [ '$factory', ...path, 'saving' ], true )

    state.set ( [ '$factory', ...path, 'value' ], value )

    output.success ( { doc } )
  }
}
