import { ElementType, StringElementType } from './types'
// Function not used. Could be removed I think.
const TEXT_BLOCKS = {
  P: true,
  H: true,
  T: true
}

/** Return true if the current element is a text block.
*/
export function isTextBlock
( elem: ElementType
): elem is StringElementType {
  const { t, i } = elem
  return TEXT_BLOCKS [ t ] && ( typeof i === 'string' )
}
