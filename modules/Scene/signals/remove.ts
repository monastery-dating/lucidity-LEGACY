import { SignalType } from '../../context.type'
import { removeAction } from '../actions/removeAction'
import { save } from '../../Data'

export const remove: SignalType =
// prepare things to add
[ removeAction
, ...save
]
