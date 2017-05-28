import { PathType, SelectionPositionType, RangeSelectionType } from './types'
export function rangeSelection
( anchorPath: PathType
, anchorOffset: number
, focusPath: PathType
, focusOffset: number
, position: SelectionPositionType
): RangeSelectionType {
  return (
    { type: 'Range'
    , anchorPath
    , anchorOffset
    , focusPath
    , focusOffset
    , position
    }
  )
}
