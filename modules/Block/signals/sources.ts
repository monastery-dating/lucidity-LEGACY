import { SignalType } from '../../context.type'
import { sourcesAction } from '../actions/sourcesAction'
import { save } from '../../Data/signals/save'
import { debounce } from '../../Utils'
import * as copy from 'cerebral-addons/copy'
import * as unset from 'cerebral-addons/unset'
import { update } from '../../Data/actions/update'

// Changes to extra sources go here.
export const sources: SignalType =
// FIXME: Simplest thing to do would be to call playback's runGraph from within
// sourceAction... We then know if we need to save more then just the main
// source... It might also make Playback code simpler.
// When 'source' changes, we have a race condition. Bad.
// [ debounce ( 2000 ) // slower then 'source' update.
[ sourcesAction
, { success:
    [ unset ( 'state:/$editor.errors' )
    , update // Optimistic write in state
    , ...save
    ]
  , error:
    [ copy ( 'input:/errors', 'state:/$editor.errors' )
    ]
  }
]
