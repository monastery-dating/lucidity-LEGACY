import { SignalType } from '../../context.type'
import { initAction } from '../actions/initAction'
import { status } from '../../Status'
import * as set from 'cerebral-addons/set'

export const init: SignalType =
[ initAction
, { success:
    [ status
    , set ( 'state:/$midi.status', 'on' )
    ]
  , error:
    [ status
    , set ( 'state:/$midi.status', 'off' )
    ]
  }
]
