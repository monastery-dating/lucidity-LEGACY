import doSelect from '../lib/doSelect'

export default function handleSelect ({input, state}) {
  const composition = state.get('editor.composition')
  const {selection} = input
  return {ops: doSelect(composition, selection)}
}
