import { SignalType } from '../../context.type'
import { finishEditing } from './finishEditing.action'
import { save } from '../../Data'
import { status } from '../../Status'

export const finishedEditing : SignalType =
[ finishEditing
, { success: [ ...save ]
  }
]
