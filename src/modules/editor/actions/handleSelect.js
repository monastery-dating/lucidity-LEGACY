import doSelect from '../lib/doSelect'

export default function handleEnter ({input, path, state}) {
  const composition = state.get('editor.composition')
  const {selection} = input
  return {ops: doSelect(composition, selection)}
}
