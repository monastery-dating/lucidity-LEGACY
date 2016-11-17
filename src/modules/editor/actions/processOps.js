
const BASE_PATH = 'editor.composition.i'

export default function processOps ({state, input}) {
  const {ops} = input
  if (!ops) {
    return
  }
  let newselection

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
