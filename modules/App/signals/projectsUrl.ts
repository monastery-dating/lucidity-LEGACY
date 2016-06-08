import { SignalType } from '../../context.type'
import * as set from 'cerebral-addons/set'

export const projectsUrl: SignalType =
[ set ( 'state:/$route', 'projects' )
, set ( 'state:/$projectId', '' )
]
