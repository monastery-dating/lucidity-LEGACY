import { doEnter } from '../lib/doEnter'

export function handleEnter
( { props, state }
) {
  const composition = state.get ( 'editor.composition' )
  const { selection } = props
  return { ops: doEnter ( composition, selection ) }
}
