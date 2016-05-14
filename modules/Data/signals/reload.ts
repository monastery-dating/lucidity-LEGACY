import { SignalType } from '../../context.type'
import { reload as reloadAction } from '../actions/reload'
import { dataToState } from '../actions/dataToState'

export const reload : SignalType =
[ reloadAction
, { success:
    [ dataToState /*, connect */ ]
  , error: []
  }
]
