import { uimapBlock } from '../../Graph'
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
  const drag: DragStartType =
  Object.assign ( {}, input.drag )

  const type = drag.ownerType === 'library' ? 'lblock' : 'block'
  drag.block = state.get ( [ 'data', type, drag.blockId ] ) 

  if ( !drag.uinode ) {
    drag.uinode = uimapBlock ( drag.block )
  }

  state.set ( path, drag )
}
