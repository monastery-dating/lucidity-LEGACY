import { BlockHelper } from '../../Block'
import { Immutable as IM } from '../../Graph'
import { ActionContextType } from '../../context.type'
import { DragStartType, DragDropType } from '../'

const dragp = [ '$dragdrop', 'drag' ]
const movep = [ '$dragdrop', 'move' ]
const dropp = [ '$dragdrop', 'drop' ]

export const dropAction =
( { state
  , input
  , output
  } : ActionContextType
) => {
  const drag: DragStartType = state.get ( dragp )
  const drop: DragDropType  = state.get ( dropp )

  state.unset ( dragp )
  state.unset ( movep )
  state.unset ( dropp )

  if ( !drop ) {
    // Not dropping on a valid zone.
    // Should it be a remove operation ?
    return
  }

  const docs = []

  const block = BlockHelper.copy
  ( state.get ( [ 'data', 'block', drag.node.blockId ] )
  )

  if ( drop.ownerType === 'library' ) {
    const lblock = IM.update ( block, 'type', 'lblock' )
    docs.push ( lblock )
  }

  else {
    docs.push ( block )

    let graph = drop.graph
    // replace blockId
    const nodeId = drop.nodeId
    graph = IM.update
    ( graph, 'nodesById', nodeId, 'blockId', block._id )

    let elem = state.get ( [ drop.ownerType ] )
    elem = IM.update ( elem, 'graph', graph )
    docs.push ( elem )
  }

  output.success ( { docs } )
}
