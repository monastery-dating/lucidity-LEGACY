import { SignalType } from '../../context.type'
import { saveDoc } from '../../Data'
import * as set from 'cerebral-addons/set'

export const name: SignalType =
[ set ( 'output:/type', 'scene' )
, set ( 'output:/key', 'name' )
, ...saveDoc
]
