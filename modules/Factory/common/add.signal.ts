import { SignalType } from '../../context.type'
import { addAction } from './add.action'
import { save } from '../../Data'
import { status } from '../../Status'

export const add : SignalType =
// prepare things to add
[ addAction
, ...save
]
