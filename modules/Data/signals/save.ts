import { SignalType } from '../../context.type'
import { saveAction } from '../actions/save'
import { selected } from './selected'
import { status } from '../../Status/actions/status'


export const save : SignalType =
[ saveAction
, { success: []
  , error: [ status ]
  }
]
