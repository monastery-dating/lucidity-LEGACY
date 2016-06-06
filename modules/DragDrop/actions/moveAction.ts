import { GraphType, GraphHelper, NodeHelper } from '../../Graph'
import { DragMoveType, DragDropType, DragStartType } from '../types'
import { ActionContextType } from '../../context.type'

const movep = [ '$dragdrop', 'move' ]
const dropp = [ '$dragdrop', 'drop' ]
const dragp = [ '$dragdrop', 'drag' ]

const nextNodeId = NodeHelper.nextNodeId

export const moveAction =
( { state
  , input
  , output
  } : ActionContextType
) => {
  const move: DragMoveType = input.move
  const drag: DragStartType = state.get ( dragp )
  const { target, clientPos } = move
  // If target is not set = no drop operation
  let drop: DragDropType = state.get ( dropp )

  if ( target ) {
    const [ ownerType, nodeId, apos ] = target.split ( '-' )

    if ( ( drop && target === drop.target ) || nodeId === 'drop' ) {
      // do not change

    }

    else if ( ownerType === drag.ownerType && nodeId === drag.node.id ) {
      // dragging on self: do nothing
      // FIXME: we should also ignore dragging on children of self
      drop = null
    }

    else if ( ownerType === 'library' ) {
      // drop on library
      state.set ( [ '$factory', 'pane', 'library' ], true )
      drop =
      { target
      , ownerType
      }
    }

    else {
      state.set ( [ '$factory', 'pane', 'library' ], false )
      // changed
      let graph: GraphType = state.get ( [ ownerType, 'graph' ] )
      let newId = nextNodeId ( graph.nodesById )
      let pos: number = parseInt ( apos )
      let parentId: string
      const block = state.get ( [ 'data', 'block', drag.node.blockId ] )

      if ( apos ) {
        // should have a way to set nodeId to 'drop' here or mark as ghost...
        graph = GraphHelper.insert
        ( graph, nodeId, pos, block )
      }
      else {
        // find node in graph
        const node = graph.nodesById [ nodeId ]
        parentId = node.parent
        if ( parentId ) {
          const parent = graph.nodesById [ parentId ]
          pos = parent.children.indexOf ( nodeId )
          graph = GraphHelper.slip
          ( graph, parent.id, pos, block )
        }
        else {
          // do not change graph
        }
      }

      // eventual drop operation
      drop =
      { target
      , nodeId: newId
      , graph
      , ownerType
      }

    }
  }

  else {
    // no target = abort
    drop = null
  }

  state.set
  ( dropp
  , drop
  )

  state.set
  ( movep
  , move
  )
}
