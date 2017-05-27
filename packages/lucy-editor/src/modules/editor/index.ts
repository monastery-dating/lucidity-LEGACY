import { processOps } from './actions/processOps'
import { handleEnterSignal } from './signals/handleEnter'
import { deleteSelectionSignal } from './signals/deleteSelection'
import { handleBackspaceSignal } from './signals/handleBackspace'
import { handleInputSignal } from './signals/handleInput'
import { handleSelectSignal } from './signals/handleSelect'

import { mockComposition } from './lib/utils/testUtils'

export const editor =
{ state:
  { composition: mockComposition ()
  }
, signals:
  { applyOpTriggered: [ processOps ]
  , backspacePressed: handleBackspaceSignal
  , enterPressed: handleEnterSignal
  , inputChanged: handleInputSignal
  , selectChanged: handleSelectSignal
  , typeOnSelection: deleteSelectionSignal
  }
}
