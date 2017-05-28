import { CompositionType, ElementType, PathType } from './types'

/* Returns the element at the given path
*/
export function getAtPath
( composition: CompositionType
, path
): ElementType {
  return path.reduce
  ( ( current, key ) => current.i [ key ], composition )
}
