import { SignalType } from '../../context.type'
import { docAction } from '../../Data/actions/docAction'
import { save } from '../../Data/signals/save'
import * as set from 'cerebral-addons/set'
import { projectChanged } from '../../FileStorage/helper/FileStorageHelper'

export const name: SignalType =
[ set ( 'output:/type', 'project' )
, set ( 'output:/key', 'name' )
// close editing on data save
, set ( 'state:/$factory.project.close', true )
, docAction
, projectChanged
, ...save
]
