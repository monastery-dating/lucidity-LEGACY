import { SignalType } from '../../context.type'
import { docAction } from '../../Data/actions/docAction'
import { save } from '../../Data/signals/save'
import { status } from '../../Status/actions/status'
import * as set from 'cerebral-addons/set'

export const name: SignalType =
[ set ( 'output:/type', 'project' )
, set ( 'output:/key', 'name' )
// close editing on data save
, set ( 'state:/$factory.project.close', true )
, docAction
, ... save
]
