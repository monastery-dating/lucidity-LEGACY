import { isTextBlock } from './isTextBlock'
import { ElementRefType, StringElementRefType } from './types'

export function canFuse
( a: ElementRefType
): a is StringElementRefType {
  return isTextBlock ( a.elem ) && a.path.length < 3
}