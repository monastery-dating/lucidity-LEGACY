import { SignalType } from '../../context.type'
import { nameAction } from '../actions/nameAction'
import { sourceAction } from '../actions/sourceAction'
import { save } from '../../Data/signals/save'
import * as copy from 'cerebral-addons/copy'
import { debounce } from '../actions/debounce'
import * as throttle from 'cerebral-addons/throttle'
import * as unset from 'cerebral-addons/unset'
import * as when from 'cerebral-addons/when'
import { update } from '../../Data/actions/update'

export const source: SignalType =
[ debounce ( 100 ) // Wait before we do anything: the user is typing
, sourceAction
, copy ( 'input:/errors', 'state:/$editor.errors' )
, when ( 'input:/doc' )
, { true: // Valid source
    [ unset ( 'state:/$editor.errors' ) // Immediate clear of errors
    , update // Optimistic write in state
    , debounce ( 500 ) // Wait for more inactivity before saving ?
    , ...save
    ]
  , false: []
  }
]
