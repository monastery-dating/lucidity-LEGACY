import { BlockHelper, BlockByIdType } from '../../Block'
import { Immutable as IM, GraphHelper, NodeHelper } from '../../Graph'
import { ComponentHelper } from '../../Library'
import { ActionContextType } from '../../context.type'
import { DragStartType, DragDropType } from '../'

const dragp = [ '$dragdrop', 'drag' ]
const movep = [ '$dragdrop', 'move' ]
const dropp = [ '$dragdrop', 'drop' ]
const rootNodeId = NodeHelper.rootNodeId

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
    if ( drag.ownerType === 'library' ) {
      // do nothing
    }

    else {
      // remove
      const graph = GraphHelper.drop ( drag.graph, drag.nodeId )
      const elem = state.get ( [ drag.ownerType ] )
      const doc = Object.assign ( {}, elem, { graph } )
      output.success ( { doc } )
    }
    return
  }

  if ( drop.ownerType === 'library' ) {
    // Do we have a block with same name in the library ?
    const node = drop.graph.nodesById [ rootNodeId ]
    const block = drop.graph.blocksById [ node.blockId ]

    const library: BlockByIdType = state.get ( [ 'data', 'component' ] )
    let doc
    for ( const k in library ) {
      const b = library [ k ]
      if ( b.name === block.name ) {
        // replace
        doc = Object.assign ( {}, b, { graph: drop.graph } )
        break
      }
    }

    if ( !doc ) {
      // new component
      doc = ComponentHelper.create ( drop.graph )
    }
    output.success ( { doc } )
  }

  else {
    let doc = state.get ( [ drop.ownerType ] )
    doc = IM.update ( doc, 'graph', drop.graph )
    output.success ( { doc } )
  }
}
