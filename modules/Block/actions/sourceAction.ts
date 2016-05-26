import { ActionContextType } from '../../context.type'
import { BlockHelper } from '../'

export const sourceAction =
( { state
  , input: { value }
  , output
  } : ActionContextType
) => {

  // prepare doc
  const doc = BlockHelper.update
  ( state.get ( [ 'block' ] )
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
