import { ActionContextType } from '../../context.type'
import { GraphType } from '../../Graph'
import { Immutable as IM } from '../../Graph/helper/Immutable'
// FIXME: why is this 'undefined' if imported from 'Graph' above ?
import { GraphHelper } from '../../Graph/helper/GraphHelper'
import { BlockHelper } from '../../Block/helper/BlockHelper'
import { BlockAddOperationType } from '../'

const rootBlockId = BlockHelper.rootBlockId

export const addAction =
( { state
  , input
  , output
  } : ActionContextType
) => {
  const { pos, parentId, ownerType, componentId } =
  <BlockAddOperationType>input
  const owner = state.get ( [ ownerType ] )
  let child: GraphType
  if ( componentId ) {
    child = state.get ( [ 'data', 'component', componentId ] ).graph
  }
  else {
    // if we have a block named 'default' in library, we use this
    const library = state.get ( [ 'data', 'component' ] )
    for ( const k in library ) {
      if ( library [ k ].name === 'default' ) {
        child = IM.update
        ( library [ k ].graph
        , 'blocksById', rootBlockId, 'name', 'new block' )
        break
      }
    }
    if ( !child ) {
      child = GraphHelper.create ( 'new block' )
    }
  }

  const graph = GraphHelper.insert ( owner.graph, parentId, pos, child )

  const ownerupdate = Object.assign ( {}, owner, { graph } )

  if ( state.get ( '$block' ) ) {
    const nid = graph.nodesById [ parentId ].children [ pos ]
    const id = graph.nodesById [ nid ].blockId
    // if editor is open, start editing name
    state.set ( '$factory.block.add', id )
  }

  output ( { doc: ownerupdate } )
}
