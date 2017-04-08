export * from './types'
export * from './helper/DragDropHelper'

import { NodeType } from '../Graph'
import { BlockAddOperationType } from '../Block'
import { DragStartType, DragMoveType, DragDropType } from './types'

export interface DragDropSignalsType {
  drag ( input: { drag: DragStartType } )
  move ( input: { move: DragMoveType } )
  drop () // no argument (we read from state)
}

import * as Model from 'cerebral-model-baobab'
import { drag } from './signals/drag'
import { drop } from './signals/drop'
import { move } from './signals/move'

export const DragDrop =
( options = {} ) => {
  return (module, controller) => {
    // $dragdrop:
    module.addState
    ( { // drag == DragStartType
        // move == DragMoveType
      }
    )

    module.addSignals
    ( { drag
      , drop
      , move
      }
    )

    return {} // meta information
  }
}
