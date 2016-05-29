import { changedAction } from '../actions/changedAction'
import { status } from '../../Status/actions/status'

export const changed =
[ changedAction
, { success: [], error: [ status ] }
]
