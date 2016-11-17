import handleEnter from './signals/handleEnter'
import deleteSelection from './signals/deleteSelection'
import handleBackspace from './signals/handleBackspace'
import handleInput from './signals/handleInput'

import mockComposition from './mockComposition.js'

export default {
  state: {
    composition: mockComposition()
  },
  signals: {
    backspacePressed: handleBackspace,
    enterPressed: handleEnter,
    inputChanged: handleInput,
    typeOnSelection: deleteSelection
  }
}
