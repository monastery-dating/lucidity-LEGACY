import { SignalType } from '../../context.type'
import { sourceAction } from '../actions/sourceAction'
import * as copy from 'cerebral-addons/copy'
import { debounce } from '../../Utils'
import * as unset from 'cerebral-addons/unset'
import { update } from '../../Data/actions/update'

export const typecheck: SignalType =
[ debounce ( 500 ) // Wait before we do anything: the user is typing
, sourceAction
, { success:
    [ unset ( 'state:/$editor.errors' )
    ]
  , error:
    [ copy ( 'input:/errors', 'state:/$editor.errors' )
    ]
  }
]
