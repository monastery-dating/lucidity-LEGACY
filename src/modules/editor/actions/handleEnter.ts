import doEnter from '../lib/doEnter'

export default function handleEnter ({input, state}) {
  const composition = state.get('editor.composition')
  const {selection} = input
  return {ops: doEnter(composition, selection)}
}
