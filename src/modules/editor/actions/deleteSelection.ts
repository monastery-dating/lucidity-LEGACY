import doBackspace from '../lib/doBackspace'

export default function deleteSelection ({input, path, state}) {
  const composition = state.get('editor.composition')
  const {selection} = input
  return {ops: doBackspace(composition, selection)}
}
