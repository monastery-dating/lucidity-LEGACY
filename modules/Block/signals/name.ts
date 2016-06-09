import { SignalType } from '../../context.type'
import { nameAction } from '../actions/nameAction'
import { selectAction } from '../actions/selectAction'
import { save } from '../../Data/signals/save'
import * as set from 'cerebral-addons/set'

export const name: SignalType =
[ nameAction
, set ( 'state:/$factory.block.close', true )
, ...save
]
