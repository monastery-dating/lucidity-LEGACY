import { SignalType } from '../../context.type'
import { removeAction } from '../actions/remove'
import { save } from '../../Data'
import { status } from '../../Status'

export const remove: SignalType =
// prepare things to add
[ removeAction
, ...save
]
