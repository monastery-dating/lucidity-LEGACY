import { ElementType, StringElementType } from './types'

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
  const { t, i, o } = elem
  return (
       ( TEXT_BLOCKS [ t ] || ! o )
    && ( typeof i === 'string' )
    ) || false
}
