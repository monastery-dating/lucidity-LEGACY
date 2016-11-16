import keyBackspace from '../lib/keyBackspace'

const BASE_PATH = 'editor.composition.i'

export default function deleteSelection ({input, path, state}) {
  const composition = state.get('editor.composition')
  const {selection} = input
  console.log('deleteSelection', selection)
  let newselection

  const ops = keyBackspace(composition, selection)
  ops.forEach(op => {
    const path = `${BASE_PATH}.${op.path.join('.i.')}`
    console.log(path)
    switch (op.op) {
      case 'update':
        state.set(path, op.value)
        break
      case 'delete':
        state.unset(path)
        break
      case 'select':
        newselection = {
          anchorPath: path,
          anchorOffset: op.offset,
          focusPath: path,
          focusOffset: op.offset
        }
        break
      default:
        throw new Error(`Unkown operation '${op.op}'`)
    }
  })
  if (newselection) {
    // FIXME: global.selection is bad find another way
    global.selection = newselection
    return {selection: newselection}
  }
}
