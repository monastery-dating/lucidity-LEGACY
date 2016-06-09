import { SignalType } from '../../context.type'
import { selectAction } from '../actions/selectAction'
import { save } from '../../Data/signals/save'

export const select: SignalType =
// prepare things to add
[ selectAction
, ...save
]
// FIXME: remove (has been replaced by selectProject in app)
