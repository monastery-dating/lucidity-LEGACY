import { ActionContextType } from '../../context.type'
import { GraphType } from '../../Graph'
// FIXME: why is this 'undefined' if imported from 'Graph' above ?
import { GraphHelper } from '../../Graph/helper/GraphHelper'
import { BlockAddOperationType } from '../'

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
    child = GraphHelper.create ( 'new block' )
  }
  const graph = GraphHelper.insert ( owner.graph, parentId, pos, child )

  const ownerupdate = Object.assign ( {}, owner, { graph } )

  // triger name edit after object save
  // FIXME
  // state.set ( [ '$factory', 'editing' ], child._id )


  output ( { doc: ownerupdate } )
}
