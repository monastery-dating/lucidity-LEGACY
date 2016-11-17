import keyEnter from '../lib/keyEnter'

export default function handleEnter ({input, path, state}) {
  const composition = state.get('editor.composition')
  const {selection} = input
  console.log('deleteSelection', selection)

  return {ops: keyEnter(composition, selection)}
}
