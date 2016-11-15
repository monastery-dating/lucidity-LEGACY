import keyBackspace from '../lib/keyBackspace'
const BASE_PATH = 'editor.composition.i'

export default function handleBackspace ({state, input}) {
  const composition = state.get('editor.composition')
  const {selection} = input

  const ops = keyBackspace(composition, selection)
  ops.forEach(op => {
    const path = `${BASE_PATH}.${op.path.join('.i.')}`
    switch (op.op) {
      case 'update':
        state.set(path, op.value)
        break
      case 'delete':
        state.unset(path)
        break
      case 'select':
        global.selection = {
          offset: op.offset,
          path
        }
        break
      default:
        throw new Error(`Unkown operation '${op.op}'`)
    }
  })
}
