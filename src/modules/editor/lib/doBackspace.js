import deleteSelection from './utils/deleteSelection'
import fixSelectOrder from './utils/fixSelectOrder'
import getNeighbours from './utils/getNeighbours'
import mergeElements from './utils/mergeElements'
import getAtPath from './utils/getAtPath'

/** Returns the list of operations to remove selected text.
 *
 */
export default function doBackspace (composition, aselection) {
  const selection = fixSelectOrder(composition, aselection)
  const {type, anchorPath, anchorOffset} = selection
  if (type === 'Caret') {
    if (anchorOffset === 0) {
      // merge with previous
      const prev = getNeighbours(composition, anchorPath)[0]
      const elem = getAtPath(composition, anchorPath)
      return mergeElements(composition, prev, {elem, path: anchorPath})
    }
  }
  return deleteSelection(composition, selection, 'Backspace')
}
