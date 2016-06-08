import { SignalType } from '../../context.type'
import { selectProject } from '../actions/selectProject'
import * as set from 'cerebral-addons/set'

export const projectUrl: SignalType =
[ set ( 'state:/$route', 'project' )
, selectProject
]
