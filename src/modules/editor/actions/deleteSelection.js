import keyBackspace from '../lib/keyBackspace'

export default function deleteSelection ({input, path, state}) {
  const composition = state.get('editor.composition')
  const {selection} = input
  console.log('deleteSelection', selection)

  return {ops: keyBackspace(composition, selection)}
}
