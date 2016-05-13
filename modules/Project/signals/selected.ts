import select from '../actions/select'
import { save } from '../../Data'
import { setStatus } from '../../Status'

export default
[ select
, { success:
    [ save
    , { success: [ setStatus ( { type: 'info', message: 'Project selected' } ) ]
      , error: []
      }
    ]
  }
]
