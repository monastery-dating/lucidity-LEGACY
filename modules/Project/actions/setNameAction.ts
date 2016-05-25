import { ActionContextType } from '../../context.type'
export const setNameAction =
( { state
  , input: { value }
  , output
  } : ActionContextType
) => {

  // prepare doc
  const doc = Object.assign
  ( {}
  , state.get ( [ 'project' ] )
  , { name: value }
  )

  const path = [ 'project', 'name' ]

  // close editable
  state.set ( [ '$factory', 'editing' ], false )
  // mark element as 'saving'
  state.set ( [ '$factory', ...path, 'saving' ], true )
  // temporary value during save
  state.set ( [ '$factory', ...path, 'value' ], value )

  output ( { doc } )
}
