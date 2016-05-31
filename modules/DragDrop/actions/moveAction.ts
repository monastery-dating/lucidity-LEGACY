import { DragMoveType } from '../types'
import { ActionContextType } from '../../context.type'

const mpath = [ '$dragdrop', 'move' ]
const dpath = [ '$dragdrop', 'drop' ]

export const moveAction =
( { state
  , input
  , output
  } : ActionContextType
) => {
  const move: DragMoveType = input.move
  const { target, clientPos } = move
  // If target is not set = no drop operation
  let drop = null

  if ( target ) {
    const [ ownerType, nodeId, pos ] = target.split ( '-' )
    // TODO: how to get pos, operation and parentId from element ?
    // - set data attributes ?
    // - just set attributes to identify node id and graph/location type ?
    //   data-node='project-id0' ? 'scene-id4-4' (4th slot on node id4 ?)
    // -> the move operation receives this and works it's way to update the
    //   '.drop' state (which shows the eventual drop operation)...
    // - On $dragdrop.drop state, update drop zones to show feedback.
    // const operation: 'add' | 'insert' = 'add' // 'insert'
    // const parentId = uinode.id
    // const pos = 0

    // eventual drop operation
    drop /*: DragDropType */ =
    {

    }
  }

  state.set
  ( dpath
  , drop
  )


  state.set
  ( mpath
  , move
  )
}
