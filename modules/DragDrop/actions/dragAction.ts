import { GraphType, rootNodeId } from '../../Graph'
import { cutGraph, dropGraph } from '../../Graph/helper/GraphHelper'
import { uimap } from '../../Graph/helper/uimap'
import { DragStartType } from '../types'
import { ActionContextType } from '../../context.type'
import * as check from 'check-types'

const dragp = [ '$dragdrop', 'drag' ]

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
    drag.dgraph = cutGraph
    ( graph
    , drag.nodeId
    )
    drag.rgraph = dropGraph ( graph, drag.nodeId )
  }

  drag.uigraph = uimap ( drag.dgraph )

  state.set ( dragp, drag )
}
