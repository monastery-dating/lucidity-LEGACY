import { SignalType } from '../../context.type'
import { nameAction } from '../actions/nameAction'
import { sourceAction } from '../actions/sourceAction'
import { save } from '../../Data'

export const source: SignalType =
[ sourceAction
, ...save
]
