import { SignalType } from '../../context.type'
import { dropAction } from '../actions/dropAction'
import { save } from '../../Data/signals/save'

export const drop: SignalType =
[ dropAction
, { success: [...save]
  }
]
