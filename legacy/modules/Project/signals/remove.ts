import { SignalType } from '../../context.type'
import { removeAction } from '../actions/removeAction'
import { save } from '../../Data/signals/save'

export const remove: SignalType =
// prepare things to add
[ removeAction
, ...save
]
