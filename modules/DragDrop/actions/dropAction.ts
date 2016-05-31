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

  if ( drop.ownerType === 'library' ) {
    if ( drag.ownerType === 'library' ) {
      // ignore ? re-add to update tags, name, etc ?
    }
    else {
      // copy to library
    }
  }

  else {
    // graph operation

    if ( drop.operation === 'add' ) {
      // add
    }

    else {
      // above a node: insert between node and parent
    }

    if ( drop.ownerType === drag.ownerType ) {
      // move
    }

    else {
      // copy to other graph
    }
  }

}
