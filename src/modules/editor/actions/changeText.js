
const BASE_PATH = 'editor.composition.i'

export default function changeText ({state, input}) {
  const path = `${BASE_PATH}.${input.path.join('.i.')}.i`
  state.set(path, input.value)
}
