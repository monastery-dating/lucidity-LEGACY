import { save as saveAction } from '../actions/save'
import { status } from '../../Status/actions/status'

export const save =
[ saveAction
, { success: [ status ]
  , error: [ status ]
  }
]
