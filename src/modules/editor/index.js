import {input, set, state} from 'cerebral/operators'
import createBlock from './signals/createBlock'
import handleBackspace from './signals/handleBackspace'

import mockComposition from './mockComposition.js'

export default {
  state: {
    composition: mockComposition()
  },
  signals: {
    backspacePressed: handleBackspace,
    enterPressed: createBlock,
    contentChanged: [
      set(state`editor.composition.i.${input`path`}`, input`value`)
    ]
  }
}
