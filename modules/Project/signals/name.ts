import { SignalType } from '../../context.type'
import { setNameAction } from '../actions/setNameAction'
import { selectAction } from '../actions/selectAction'
import { save } from '../../Data'

export const name: SignalType =
[ setNameAction
, selectAction
, ...save
]
