import { deleteSelection } from './utils/deleteSelection'
import { getNeighbours } from './utils/getNeighbours'
import { mergeElements } from './utils/mergeElements'
import { getAtPath } from './utils/getAtPath'

/** Returns the list of operations to remove selected text.
 *
 */
export function doBackspace
( composition
, selection
) {
  const { type, anchorPath, anchorOffset } = selection
  if ( type === 'Caret' ) {
    if ( anchorOffset === 0 ) {
      // merge with previous
      const prev = getNeighbours ( composition, anchorPath ) [ 0 ]
      if ( prev ) {
        const elem = getAtPath ( composition, anchorPath )
        return mergeElements ( composition, prev, { elem, path: anchorPath } )
      } else {
        return []
      }
    }
  }
  return deleteSelection ( composition, selection, 'Backspace' )
}
