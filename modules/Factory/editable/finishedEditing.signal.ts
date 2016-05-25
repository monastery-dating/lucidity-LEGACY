import { SignalType } from '../../context.type'
import { finishEditing } from './finishEditing.action'
import { saveAction, selected } from '../../Data'
import { status } from '../../Status'

export const finishedEditing : SignalType =
[ finishEditing
, { success:
    [ saveAction
    , { success: [ ...selected ]
      , error: [ status ]
      }
    ]
  }
]
