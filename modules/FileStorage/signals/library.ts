import { SignalType } from '../../context.type'
import { libraryAction } from '../actions/libraryAction'
import { save } from '../../Data/signals/save'
import * as copy from 'cerebral-addons/copy'
import { debounce } from '../../Utils'
import * as unset from 'cerebral-addons/unset'
import { update } from '../../Data/actions/update'

export const source: SignalType =
[ libraryAction
, { success:
    [ update // Optimistic write in state. This can trigger a 'sources' update.
    , ...save
    ]
  , error:
    [ // FIXME: status
    ]
  }
]
