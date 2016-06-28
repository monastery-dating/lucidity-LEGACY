import { SignalType } from '../../context.type'
import { saveAction } from '../actions/saveAction'
import { status } from '../../Status/actions/status'
import { docChanged } from '../../FileStorage/helper/FileStorageHelper'

export const save : SignalType =
[ docChanged
, saveAction
, { success: []
  , error: [ status ]
  }
]
