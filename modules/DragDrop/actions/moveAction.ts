import { GraphType } from '../../Graph'
import { insertGraph, slipGraph } from '../../Graph/helper/GraphHelper'
import { nextNodeId } from '../../Graph/helper/NodeHelper'
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

    if ( ( drop && target === drop.target ) || nodeId === 'drop' ) {
      // do not change
    }

    else if ( ownerType === 'library' ) {
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

      let newId = nextNodeId ( graph.nodesById )
      let pos: number = parseInt ( apos )
      let parentId: string
      const child = drag.dgraph

      if ( apos ) {
        // should have a way to set nodeId to 'drop' here or mark as ghost...
        graph = insertGraph
        ( graph, nodeId, pos, child )
        nodeId = null
      }
      else {
        // find node in graph
        const node = graph.nodesById [ nodeId ]
        if ( !node ) {
          // drag move happens before proper ui update
          return
        }
        parentId = node.parent
        if ( parentId ) {
          const parent = graph.nodesById [ parentId ]
          pos = parent.children.indexOf ( nodeId )
          graph = slipGraph
          ( graph, parent.id, pos, child )
        }
        else {
          // do not change graph
        }
      }

      // TODO: we could save the operation so that we have live preview
      // of the operation.

      // eventual drop operation
      drop =
      { target
      , ghostId: newId
      , nodeId
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
