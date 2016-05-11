import set from '../actions/set'
import save from '../../Data/actions/save'

export default
[ set
, { success:
    [ save, { success: [], error: [] } ]
  }
]
