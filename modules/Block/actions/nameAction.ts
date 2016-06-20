import { ActionContextType } from '../../context.type'
import { nameBlock } from '../helper/BlockHelper'
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

  const odoc = state.get ( select.ownerType )
  const oblock = odoc.graph.blocksById [ select.id ]
  const block = nameBlock ( oblock, value )
  const doc = IM.update ( odoc, 'graph', 'blocksById', select.id, block )
  output ( { doc } )
}
