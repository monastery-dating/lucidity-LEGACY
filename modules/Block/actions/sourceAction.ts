import { ActionContextType } from '../../context.type'
import { BlockHelper } from '../'
import { GraphType, Immutable as IM } from '../../Graph'

export const sourceAction =
( { state
  , input: { value }
  , output
  } : ActionContextType
) => {

  const select = state.get ( [ '$block' ] )
  if ( !select ) {
    // no block visible
    return
  }

  const odoc = state.get ( select.ownerType )
  const graph: GraphType = odoc.graph
  const source = graph.blocksById [ select.id ].source
  if ( source === value ) {
    output.error ( {} )
    return
  }

  const doc = IM.update
  ( odoc
  , 'graph', 'blocksById', select.id
  , ( block ) => BlockHelper.update ( block, { source: value } )
  )

  output.success ( { doc } )
}
