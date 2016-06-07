import { GraphType } from '../../Graph'
import { NodeHelper } from '../../Graph/helper/NodeHelper'
import { GraphHelper } from '../../Graph/helper/GraphHelper'
import { uimap } from '../../Graph/helper/uimap'
import { DragStartType } from '../types'
import { BlockHelper } from '../../Block/helper/BlockHelper'
import { ActionContextType } from '../../context.type'
import * as check from 'check-types'

const dragp = [ '$dragdrop', 'drag' ]
const rootNodeId = NodeHelper.rootNodeId

export const dragAction =
( { state
  , input
  , output
  } : ActionContextType
) => {
  const drag: DragStartType =
  Object.assign ( {}, input.drag )

  if ( drag.ownerType === 'library' ) {
    drag.dgraph = state.get ( [ 'data', 'component', drag.componentId, 'graph' ] )
  }

  else {
    let graph = state.get ( [ drag.ownerType, 'graph' ] )
    const otype = drag.ownerType === 'project' ? 'scene' : 'project'
    drag.dgraph = GraphHelper.cut
    ( graph
    , drag.nodeId
    )
    drag.rgraph = GraphHelper.drop ( graph, drag.nodeId )
  }

  drag.uigraph = uimap ( drag.dgraph )

  state.set ( dragp, drag )
}
