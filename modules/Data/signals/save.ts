import { SignalType } from '../../context.type'
import { save as saveAction } from '../actions/save'
import { selectAction } from '../actions/select'
import { status } from '../../Status/actions/status'

const doSave =
[ saveAction
, { success: [ status ]
  , error: [ status ]
  }
]

export const save : SignalType =
[ saveAction
, { success:
    [ status
    , selectAction
    , { select: [ ...doSave ] }
    ]
  , error: [ status ]
  }
]
