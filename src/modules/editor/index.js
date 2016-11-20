import handleOp from './signals/handleOp'
import handleEnter from './signals/handleEnter'
import deleteSelection from './signals/deleteSelection'
import handleBackspace from './signals/handleBackspace'
import handleInput from './signals/handleInput'
import handleSelect from './signals/handleSelect'

import {mockComposition} from './lib/utils/testUtils.js'

export default {
  state: {
    composition: mockComposition()
  },
  signals: {
    applyOpTriggered: handleOp,
    backspacePressed: handleBackspace,
    enterPressed: handleEnter,
    inputChanged: handleInput,
    selectChanged: handleSelect,
    typeOnSelection: deleteSelection
  }
}
