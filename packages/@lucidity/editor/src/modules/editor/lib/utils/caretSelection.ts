import { CaretSelectionType, SelectionPositionType } from './types'

export function caretSelection
( path: string []
, offset: number
, position: SelectionPositionType
): CaretSelectionType {
  return (
    { type: 'Caret'
    , anchorPath: path
    , anchorOffset: offset
    , position
    }
  )
}
