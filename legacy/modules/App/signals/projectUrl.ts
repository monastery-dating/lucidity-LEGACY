import { SignalType } from '../../context.type'
import { selectAction as selectProject } from '../../Project'
import * as set from 'cerebral-addons/set'

export const projectUrl: SignalType =
[ set ( 'state:/$route', 'project' )
, selectProject
]
