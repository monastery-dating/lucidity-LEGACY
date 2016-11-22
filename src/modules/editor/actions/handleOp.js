import doOperation from '../lib/doOperation'

export default function handleOp ({input, state}) {
  const composition = state.get('editor.composition')
  const {selection, op} = input
  return {ops: doOperation(composition, selection, op)}
}
