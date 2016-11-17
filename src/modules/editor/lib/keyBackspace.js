import deleteSelection from './deleteSelection'
import fixSelectOrder from './fixSelectOrder'
import getNeighbours from './getNeighbours'
import mergeElements from './mergeElements'
import getAtPath from './getAtPath'

/** Returns the list of operations to remove selected text.
 *
 */
export default function keyBackspace (composition, aselection) {
  const selection = fixSelectOrder(composition, aselection)
  const {noSelection, anchorPath, anchorOffset} = selection
  if (noSelection) {
    if (anchorOffset === 0) {
      // merge with previous
      const prev = getNeighbours(composition, anchorPath)[0]
      const elem = getAtPath(composition, anchorPath)
      return mergeElements(composition, prev, {elem, path: anchorPath})
    }
  }
  return deleteSelection(composition, selection, 'Backspace')
}
