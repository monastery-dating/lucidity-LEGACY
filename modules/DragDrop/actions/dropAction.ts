import { BlockHelper, BlockByIdType } from '../../Block'
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

  const block = BlockHelper.copy ( drag.block )

  if ( drop.ownerType === 'library' ) {
    // Do we have a block with same name in the library ?
    const library: BlockByIdType = state.get ( [ 'data', 'lblock' ] )
    let lblock
    for ( const k in library ) {
      const b = library [ k ]
      if ( b.name === block.name ) {
        // replace
        lblock = Object.assign
        ( {}, b, block, { type: 'lblock', _id: b._id } )
      }

    }

    if ( !lblock ) {
      lblock = Object.assign ( {}, block, { type: 'lblock' } )
    }
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
