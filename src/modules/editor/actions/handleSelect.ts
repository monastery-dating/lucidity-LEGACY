import { doSelect } from '../lib/doSelect'

export function handleSelect
( { props, state } ) {
  const composition = state.get ( 'editor.composition' )
  const { selection } = props 
  return { ops: doSelect ( composition, selection ) }
}
