import { SignalType } from '../../context.type'
import * as set from 'cerebral-addons/set'

export const userUrl: SignalType =
[ set ( 'state:/$route', 'user' )
]
