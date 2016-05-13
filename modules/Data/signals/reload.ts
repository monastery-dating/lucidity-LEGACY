import { reload as reloadAction } from '../actions/reload'
import { dataToState } from '../actions/dataToState'

export const reload =
[ reloadAction
, { success: [ dataToState /*, connect */ ]
  , error: []
  }
]
