import { SignalType } from '../../context.type'
import { reload as reloadAction } from '../actions/reload'
import { dataToState } from '../actions/dataToState'
import { selectAction as selectProject } from '../../Project'
import * as copy from 'cerebral-addons/copy'
import * as when from 'cerebral-addons/when'

export const reload : SignalType =
[ reloadAction
, { success:
    [ dataToState
    , when ( 'state:/$projectId' )
    , { true:
        [ copy ( 'state:/$projectId', 'output:/_id' )
        , selectProject
        ]
      , false: []
      }
    ]
  , error: []
  }
]
