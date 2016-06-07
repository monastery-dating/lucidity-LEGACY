import { ActionContextType } from '../../context.type'
import { BlockHelper } from '../'
import { GraphType, Immutable as IM } from '../../Graph'

export const sourceAction =
( { state
  , input: { value }
  , output
  } : ActionContextType
) => {

  // prepare doc
  const select = state.get ( [ '$block' ] )
  if ( !select ) {
    return
  }

  const doc = IM.update
  ( state.get ( [ select.ownerType ] )
  , 'graph', 'blocksById', select.id
  , ( block ) => BlockHelper.update ( block, { source: value } )
  )

  output ( { doc } )
}
