import { ActionContextType } from '../../context.type'
import { BlockHelper } from '../'
import { GraphType, Immutable as IM } from '../../Graph'

export const nameAction =
( { state
  , input: { value }
  , output
  } : ActionContextType
) => {

  const path = [ 'block', 'name' ]

  // close editable
  state.set ( [ '$factory', 'editing' ], false )
  // mark element as 'saving'
  state.set ( [ '$factory', ...path, 'saving' ], true )
  // temporary value during save
  state.set ( [ '$factory', ...path, 'value' ], value )

  const select = state.get ( [ '$block' ] )
  if ( !select ) {
    // no block selected
    return
  }

  const doc = IM.update
  ( state.get ( [ select.ownerType ] )
  , 'graph', 'blocksById', select.id
  , ( block ) => BlockHelper.update ( block, { name: value } )
  )

  output ( { doc } )
}
