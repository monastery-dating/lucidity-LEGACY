import { SignalType } from '../../context.type'
import { dropAction } from '../actions/dropAction'
import { save } from '../../Data'
import { add } from '../../Block'

export const drop: SignalType =
[ dropAction
, { success: []
  }
]
