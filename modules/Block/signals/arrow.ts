import { SignalType } from '../../context.type'
import { nameAction } from '../actions/nameAction'
import { save } from '../../Data/signals/save'
import { arrowAction } from '../actions/arrowAction'
// import { source } from '../signals/source'

export const arrow: SignalType =
[ arrowAction
, ...save
]
