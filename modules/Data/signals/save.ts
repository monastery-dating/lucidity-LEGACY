import { SignalType } from '../../context.type'
import { saveAction } from '../actions/save'
import { status } from '../../Status/actions/status'


export const save : SignalType =
[ saveAction
, { success: []
  , error: [ status ]
  }
]
