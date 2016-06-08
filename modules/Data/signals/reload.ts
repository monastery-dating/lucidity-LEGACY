import { SignalType } from '../../context.type'
import { reload as reloadAction } from '../actions/reload'
import { dataToState } from '../actions/dataToState'
import { selectProject } from '../../App/actions/selectProject'
import * as copy from 'cerebral-addons/copy'

export const reload : SignalType =
[ reloadAction
, { success:
    [ dataToState
    , copy ( 'state:/$projectId', 'output:/_id' )
    , selectProject
    ]
  , error: []
  }
]
