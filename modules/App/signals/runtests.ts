import testing from '../../Test/actions/testing'
import runTests from '../../Test/actions/runall'
import stats from '../../Test/actions/stats'
import status from '../../Status/actions/set'

export default
[ testing
, [ runTests, { success: [ stats, { success: [ status ] } ] } ] // async
]
