import { BlockHelper } from '../../Block'
import { Immutable as IM } from '../../Graph'
import { ActionContextType } from '../../context.type'
import { DragStartType, DragDropType } from '../'

const dragPath = [ '$dragdrop', 'drag' ]
const movePath = [ '$dragdrop', 'move' ]
const dropPath = [ '$dragdrop', 'drop' ]

export const dropAction =
( { state
  , input
  , output
  } : ActionContextType
) => {
  const drag: DragStartType = state.get ( dragPath )
  const drop: DragDropType  = state.get ( dropPath )

  state.unset ( dragPath )
  state.unset ( movePath )

  if ( !drop ) {
    // Not dropping on a valid zone.
    // Should it be a remove operation ?
    return
  }

  const block = BlockHelper.copy
  ( state.get ( [ 'data', 'block', drag.node.blockId ] )
  )
  const docs = [ block ]

  // FIXME: handle drop on library
  let graph = drop.graph
  // replace blockId
  const nodeId = drop.nodeId
  graph = IM.update
  ( graph, 'nodesById', nodeId, 'blockId', block._id )

  let elem = state.get ( [ drop.ownerType ] )
  elem = IM.update ( elem, 'graph', graph )
  docs.push ( elem )

  // output.success ( { docs } )
}
