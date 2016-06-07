import { uimap, GraphHelper, GraphType, NodeHelper } from '../../Graph'
import { DragStartType } from '../types'
import { BlockHelper } from '../../Block'
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
    drag.graph = state.get ( [ 'data', 'component', drag.componentId, 'graph' ] )
  }

  else {
    drag.graph = GraphHelper.cut
    ( state.get ( [ drag.ownerType, 'graph' ] )
    , drag.nodeId
    )
  }

  drag.uigraph = uimap ( drag.graph )

  state.set ( dragp, drag )
}
