import setLoading from '../actions/setLoading'
import loadData from '../../Data/actions/load'
import runtests from './runtests'

export default
[ setLoading
, loadData
, ...runtests
]
