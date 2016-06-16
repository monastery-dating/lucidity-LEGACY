import { SignalType } from '../../context.type'
import { nameAction } from '../actions/nameAction'
import { sourceAction } from '../actions/sourceAction'
import { save } from '../../Data/signals/save'
import * as throttle from 'cerebral-addons/throttle'

export const source: SignalType =
[ sourceAction
, { success:
  [ throttle ( 500, [ ...save ] ) ]
  , error: []
  }
]
