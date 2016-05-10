import testing from '../../Test/actions/testing'
import runTests from '../../Test/actions/runall'
import stats from '../../Test/actions/stats'

export default
[ testing
, [ runTests, { success: [ stats ] } ] // async
]
