import { ActionContextType } from '../../context.type'
export const sourceAction =
( { state
  , input: { value }
  , output
  } : ActionContextType
) => {

  // prepare doc
  const doc = Object.assign
  ( {}
  , state.get ( [ 'block' ] )
  , { source: value }
  )


  // close editable
  /*
  const path = [ 'block', 'source' ]
  state.set ( [ '$factory', 'editing' ], false )
  // mark element as 'saving'
  state.set ( [ '$factory', ...path, 'saving' ], true )
  // temporary value during save
  state.set ( [ '$factory', ...path, 'value' ], value )
  */

  output ( { doc } )
}
