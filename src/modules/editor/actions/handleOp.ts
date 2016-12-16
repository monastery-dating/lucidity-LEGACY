import doOperation from '../lib/doOperation'

export default function handleOp ({input, state}) {
  const composition = state.get('editor.composition')
  const {selection, op, opts} = input
  return {ops: doOperation(composition, selection, op, opts)}
}
