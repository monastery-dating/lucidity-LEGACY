import deleteSelection from './deleteSelection'

/** Returns the list of operations to remove selected text.
 *
 */
export default function keyBackspace (composition, selection) {
  return deleteSelection(composition, selection, 'Backspace')
}
