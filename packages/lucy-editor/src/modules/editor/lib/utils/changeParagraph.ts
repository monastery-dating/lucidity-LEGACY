import { getAtPath } from './getAtPath'
import { CompositionType, ElementOptionsType, OperationsType, SelectionType } from './types'

export function changeParagraph
( composition: CompositionType
, selection: SelectionType
, opts?: ElementOptionsType
): OperationsType {
  const path = selection.anchorPath.slice ( 0, 1 )
  const elem = getAtPath ( composition, path )
  const value = Object.assign ( {}, elem, { o: opts } )
  if ( ! opts ) {
    delete value.o
  }
  return (
    [ { op: 'update'
      , path
      , value
      }
    , { op: 'select', value: selection }
    ]
  )
}
