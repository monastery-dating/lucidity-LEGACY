import { DragStartType } from '../types'
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
  state.set ( path, drag )
}
