import { SignalType } from '../../context.type'
import { sourceAction } from '../actions/sourceAction'
import { save } from '../../Data/signals/save'
import * as copy from 'cerebral-addons/copy'
import { debounce } from '../../Utils'
import * as unset from 'cerebral-addons/unset'
import { update } from '../../Data/actions/update'

export const source: SignalType =
[ debounce ( 500 ) // Wait before we do anything: the user is typing
, sourceAction
, { success:
    [ unset ( 'state:/$editor.errors' )
    , update // Optimistic write in state. This can trigger a 'sources' update.
    , debounce ( 500 ) // Wait for more inactivity before saving ?
    , ...save
    ]
  , error:
    [ copy ( 'input:/errors', 'state:/$editor.errors' )
    ]
  }
]
