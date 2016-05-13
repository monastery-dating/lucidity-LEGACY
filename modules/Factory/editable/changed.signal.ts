import { finishEditing } from './finishEditing.action'
import { save } from '../../Data'
import { status } from '../../Status'

export const changed =
[ finishEditing
, { success:
    [ save
    , { success: [ status ]
      , error: [ status ]
      }
    ]
  }
]
