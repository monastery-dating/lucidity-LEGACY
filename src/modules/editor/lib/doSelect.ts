import { isParagraphStart } from './utils/isParagraphStart'
import { CompositionType, SelectionType, OperationType } from './utils/types'

/** Return toolbox operations related to selection change
*/
export function doSelect
( composition: CompositionType
, selection: SelectionType
, ops: OperationType [] = []
) {
  const { type, anchorPath, anchorOffset, anchorValue, position } = selection

  if ( type === 'Caret' ) {
    if ( isParagraphStart ( composition, anchorPath, anchorOffset, anchorValue ) ) {
      if ( anchorValue === '\u200B' ) {
        ops.push
        ( { op: 'toolbox'
          , value: { type: 'ParagraphEmpty', position }
          }
        )
      } else {
        ops.push
        ( { op: 'toolbox'
          , value: { type: 'Paragraph', position }
          }
        )
      }
    } else {
      ops.push
      ( { op: 'toolbox'
        , value: { type: 'None' }
        }
      )
    }
  } else if ( type === 'Range' ) {
    ops.push
    ( { op: 'toolbox'
      , value: { type: 'Select', position }
      }
    )
  }
  return ops
}
