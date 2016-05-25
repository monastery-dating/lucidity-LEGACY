import { SignalType } from '../../context.type'
import { saveAction } from '../actions/save'
import { selectAction } from '../actions/select'
import { status } from '../../Status/actions/status'

export const selected : SignalType =
[ selectAction
, { select:
    [ saveAction
    , { success: []
      , error: [ status ]
      }
    ]
  }
]
