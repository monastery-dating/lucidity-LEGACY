import { doOperation } from '../lib/doOperation'

export function handleOp
( { props, state } ) {
  const composition = state.get ( 'editor.composition' )
  const { selection, op, opts } = props
  return { ops: doOperation ( composition, selection, op, opts ) }
}
