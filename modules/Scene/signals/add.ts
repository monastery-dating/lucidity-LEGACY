import { SignalType } from '../../context.type'
import { addAction } from '../actions/addAction'
import { selectAction } from '../actions/selectAction'
import { save } from '../../Data'

export const add: SignalType =
[ addAction
, selectAction
, ...save
]
