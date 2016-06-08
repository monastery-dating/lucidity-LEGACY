import { SignalType } from '../../context.type'
import { saveDoc } from '../../Data'
import * as set from 'cerebral-addons/set'

export const libraryGithubToken: SignalType =
[ set ( 'output:/type', 'user' )
, set ( 'output:/key', 'libraryGithubToken' )
, ...saveDoc
]
