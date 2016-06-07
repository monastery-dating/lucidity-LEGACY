import { SignalType } from '../../context.type'
import { dropAction } from '../actions/dropAction'
import { save } from '../../Data'

export const drop: SignalType =
[ dropAction
, { success: [...save]
  }
]
