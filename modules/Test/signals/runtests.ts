import { testing } from '../actions/testing'
import { runall } from '../../Test/actions/runall'
import { stats } from '../../Test/actions/stats'
import { status } from '../../Status/actions/status'

export const runtests =
[ testing
, status
, [ runall, { success: [ stats, { success: [ status ] } ] } ] // async
]
