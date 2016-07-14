import { GraphType, nextNodeId } from '../../Graph'
import { insertGraph, slipGraph } from '../../Graph/helper/GraphHelper'
import { DragMoveType, DragDropType, DragStartType } from '../types'
import { ActionContextType } from '../../context.type'

const movep = [ '$dragdrop', 'move' ]
const dropp = [ '$dragdrop', 'drop' ]
const dragp = [ '$dragdrop', 'drag' ]

export const moveAction =
( { state
  , input
  , output
  } : ActionContextType
) => {
  const move: DragMoveType = input.move
  const drag: DragStartType = state.get ( dragp )
  const { target, clientPos } = move
  const copy = drag.copy || move.copy
  // If target is not set = no drop operation
  let drop: DragDropType = state.get ( dropp )

  if ( target && target !== '' ) {
    let [ ownerType, nodeId, apos ] = target.split ( '-' )

    if ( ownerType === 'library' ) {
      if ( drag.ownerType === 'library' ) {
        // abort
        drop = null
      }

      else {
        // drop on library
        state.set ( [ '$factory', 'pane', 'library' ], true )
        drop =
        { target
        , ownerType
        }

      }
    }

    else {
      // changed
      let graph: GraphType

      if ( drag.ownerType === ownerType && ! copy ) {
        // when dropping on drag origin, we use rest graph
        graph = drag.rgraph
      }
      else {
        graph = state.get ( [ ownerType, 'graph' ] )
      }

      let slotIdx: number = parseInt ( apos )
      let parentId: string
      const child = drag.dgraph

      // Find node in graph
      const node = graph.nodesById [ nodeId ]
      if ( !node ) {
        // Drag move happens before proper ui update ?
        return
      }

      if ( node.children [ slotIdx ] ) {
        // Slip
        graph = slipGraph
        ( graph, nodeId, slotIdx, child )
      }
      else {
        // We compute graph used to preview operation in Playback
        graph = insertGraph
        ( graph, nodeId, slotIdx, child )
      }

      // eventual drop operation
      drop =
      { target
      , nodeId
      , slotIdx
      , graph
      , ownerType
      , copy
      }

    }

    state.set ( dropp, drop )
  }

  else if ( drop ) {
    // no target = abort
    state.unset ( dropp )
  }

  state.set ( movep, move )
}
