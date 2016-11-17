import keyEnter from '../lib/keyEnter'

export default function handleEnter ({input, path, state}) {
  const composition = state.get('editor.composition')
  const {selection} = input
  return {ops: keyEnter(composition, selection)}
}
