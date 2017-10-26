/*
import * as copy from 'cerebral-addons/copy'
import { debounce } from '../../Utils'
import { source } from './source'
import { SignalType } from '../../context.type'
import { sourceAction } from '../actions/sourceAction'
import * as unset from 'cerebral-addons/unset'
import { update } from '../../Data/actions/update'

export const typecheck: SignalType =
[ debounce ( 500 ) // Wait before we do anything: the user is typing
, { accepted:
    [ sourceAction
    , { success:
        [ unset ( 'state:/$editor.errors' )
        , debounce ( 1000 ) // valid code is auto-saved after some s
        , { accepted: [ ...source ]
          , ignored: []
          }
        ]
      , error:
        [ copy ( 'input:/errors', 'state:/$editor.errors' )
        ]
      }
    ]
  , ignored: []
  }
]
*/