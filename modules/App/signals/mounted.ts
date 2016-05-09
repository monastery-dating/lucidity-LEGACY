import setLoading from '../actions/setLoading'
import runtests from './runtests'

export default
[ setLoading
, ...runtests
]
