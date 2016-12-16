import stripZeroWidthChar from '../lib/stripZeroWidthChar'

const BASE_PATH = 'editor.composition.i'

export default function changeText ({state, input}) {
  const path = `${BASE_PATH}.${input.selection.anchorPath.join('.i.')}.i`
  const {selection, value} = stripZeroWidthChar(input.value, input.selection)
  state.set(path, value)

  if (selection) {
    return {ops: [{
      op: 'select',
      value: selection
    }]}
  }
}
