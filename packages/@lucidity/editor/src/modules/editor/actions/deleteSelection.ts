import { doBackspace } from '../lib/doBackspace'

export function deleteSelection ( { props, path, state } ) {
  const composition = state.get('editor.composition')
  const { selection } = props
  return { ops: doBackspace ( composition, selection ) }
}
