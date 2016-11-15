import {input, set, state} from 'cerebral/operators'
import createBlock from './signals/createBlock'
import mockComposition from './mockComposition.js'

export default {
  state: {
    composition: mockComposition()
  },
  signals: {
    enterPressed: createBlock,
    contentChanged: [
      set(state`editor.composition.i.${input`path`}`, input`value`)
    ]
  }
}
