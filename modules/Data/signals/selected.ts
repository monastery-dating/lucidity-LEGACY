import { SignalType } from '../../context.type'
import { save as saveAction } from '../actions/save'
import { selectAction } from '../actions/select'
import { status } from '../../Status/actions/status'

export const selected : SignalType =
[ selectAction
, { select:
    [ saveAction
    , { success: [ status ]
      , error: [ status ]
      }
    ]
  }
]
