import { SignalType } from '../../context.type'
import { addAction } from '../actions/addAction'
import { save } from '../../Data'

export const add: SignalType =
[ addAction
, ...save
]
