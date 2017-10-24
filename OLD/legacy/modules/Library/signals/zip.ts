import { SignalType } from '../../context.type'
import { zipAction } from '../actions/zipAction'
import { downloadAction } from '../../Data/actions/downloadAction'
import * as set from 'cerebral-addons/set'

export const zip: SignalType =
[ zipAction
, { success: [ downloadAction ] }
]
