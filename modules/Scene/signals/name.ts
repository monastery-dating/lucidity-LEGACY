import { SignalType } from '../../context.type'
import { saveDoc } from '../../Data/signals/saveDoc'
import * as set from 'cerebral-addons/set'

export const name: SignalType =
[ set ( 'output:/type', 'scene' )
, set ( 'output:/key', 'name' )
// close editing on data save
, set ( 'state:/$factory.scene.close', true )
, ...saveDoc
]
