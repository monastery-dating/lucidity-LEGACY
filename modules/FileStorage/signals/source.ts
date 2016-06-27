import { SignalType } from '../../context.type'
import { sourceAction } from '../actions/sourceAction'
import { save } from '../../Data/signals/save'
import * as copy from 'cerebral-addons/copy'
import { debounce } from '../../Utils'
import * as unset from 'cerebral-addons/unset'
import { update } from '../../Data/actions/update'

export const source: SignalType =
[ sourceAction
, { success:
    [ update // Optimistic write in state. This can trigger a 'sources' update.
    , ...save
    ]
  , error:
    [ // FIXME: status with errors ?
    ]
  }
]
