import { getNeighbours } from './getNeighbours'
import { CompositionType, ElementRefType, ElementsType, PathType } from './types'

export function getSiblings
( composition: CompositionType
, path: PathType
): [ ElementRefType | undefined, ElementRefType | undefined ] {
  return getNeighbours ( composition, path, true )
}
