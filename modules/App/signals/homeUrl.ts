import { SignalType } from '../../context.type'
import * as set from 'cerebral-addons/set'

export const homeUrl: SignalType =
[ set ( 'state:/$route', 'home' )
]
