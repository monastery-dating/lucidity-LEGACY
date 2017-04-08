import { SignalType } from '../../context.type'
import { addAction } from '../actions/addAction'
import { save } from '../../Data/signals/save'
import * as copy from 'cerebral-addons/copy'

export const add: SignalType =
[ addAction
, { success:
    [ // This is a flag that will set name editing after db object
      // is selected.
    , copy ( 'input:/projectId', 'state:/$factory.editing')
    , ...save
    ]
  , error:
    [ // user cancel
    ]
  }
]
