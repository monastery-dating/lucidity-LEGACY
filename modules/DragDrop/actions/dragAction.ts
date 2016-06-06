import { DragStartType } from '../types'
import { BlockHelper } from '../../Block'
import { ActionContextType } from '../../context.type'
import * as check from 'check-types'

const path = [ '$dragdrop', 'drag' ]

export const dragAction =
( { state
  , input
  , output
  } : ActionContextType
) => {
  const drag: DragStartType = input.drag

  if ( !drag.uinode ) {
    const block = state.get ( [ 'data', 'block', drag.node.blockId ] )
    // FIXME
    // drag.uinode = uimapBlock ( block )
  }

  state.set ( path, drag )
}
