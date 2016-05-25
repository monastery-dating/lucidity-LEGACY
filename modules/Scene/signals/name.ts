import { SignalType } from '../../context.type'
import { nameAction } from '../actions/nameAction'
import { selectAction } from '../actions/selectAction'
import { save } from '../../Data'

export const name: SignalType =
[ nameAction
, selectAction
, ...save
]
