import { deleteSelection } from './utils/deleteSelection'
import { extractPaths, BIGGEST_PATH, SMALLEST_PATH } from './utils/inSelection'
import { caretSelection } from './utils/caretSelection'
import { getPosition } from './utils/getPosition'
import { isTextBlock } from './utils/isTextBlock'
import { makeRef } from './utils/makeRef'
import { newParagraph } from './utils/newParagraph'
import { splitText } from './utils/splitText'
import { trimLeft, trimRight } from './utils/trim'
import { isStringElement, CompositionType, ElementRefType
       , GroupElementType, OperationType, SelectOperationType
       , SelectionType } from './utils/types'

/** Returns the list of operations after enter pressed.
 *
 */
export function doEnter
( composition: CompositionType
, selection: SelectionType
) {
  let deleteOps = deleteSelection ( composition, selection )

  let { anchorPath, anchorOffset } = selection
  if ( deleteOps ) {
    const selectOp = <SelectOperationType | undefined> deleteOps.find ( op => op.op === 'select' )
    if ( selectOp ) {
      anchorPath = selectOp.value.anchorPath
      anchorOffset = selectOp.value.anchorOffset
    }
  }

  const ops: OperationType [] = deleteOps || []

  const parentPath = anchorPath.slice ( 0, 1 )
  const parent = composition.i [ parentPath [ 0 ] ]
  // 1. Create new paragraph
  const newpara = newParagraph ( composition, { path: parentPath, elem: parent } )
  const newelem = newpara.elem
  if ( isStringElement ( parent ) ) {
    // Split text.
    if ( anchorOffset < parent.i.length ) {
      const { before, after } = splitText ( parent.i, anchorOffset )
      ops.push
      ( { op: 'update'
        , path: parentPath
        , value: Object.assign ( {}, parent, { i: trimRight ( before ) } )
        }
      )
      newelem.i = trimLeft ( after )
    }
    // No child to move.
  } else {
    const anchorPosition = getPosition ( composition, anchorPath )
    // 2. Collect end of paragraph
    // TODO: move this in separate function
    const touchedElements: ElementRefType [] = []
    let lastPosition = -1
    extractPaths
    ( parent.i
      // Any missing level is "start is smaller"
    , anchorPosition.concat ( SMALLEST_PATH )
      // Any missing level is "end is bigger"
    , BIGGEST_PATH
    , 1
    , parentPath
    , touchedElements
    )
    touchedElements.forEach
    ( ( { path, elem }, idx ) => {
      if ( idx === 0 ) {
        if ( isStringElement ( elem ) ) {
          if ( anchorOffset < elem.i.length ) {
            const { before, after } = splitText ( elem.i, anchorOffset )
            ops.push
            ( { op: 'update'
              , path
              , value: Object.assign ( {}, elem, { i: trimRight ( before ) } )
            })
            newelem.i = trimLeft ( after )
          }
        } else {
          // Maybe extractPaths only returns string elements. TODO: check.
          throw new Error ( 'NOT IMPLEMENTED' )
        }
      } else if ( idx === 1 && isTextBlock ( elem ) ) {
        // fuse with newelem
        Object.assign
        ( newelem
        , { i: newelem.i + elem.i }
        )
        ops.push
        ( { op: 'delete'
          , path
          }
        )
      } else {
        // TODO: extract and use moveInPara from deleteSelection
        if ( isStringElement ( newelem ) ) {
          
          (<any> newelem ).i =
          { [ makeRef () ]:
            { t: 'T'
            , p: ++lastPosition
            , i: newelem.i
            }
          }
        }
        newelem.i[path[path.length - 1]] = Object.assign(
          {}, elem, {p: ++lastPosition}
        )
        ops.push
        ( { op: 'delete'
          , path
          }
        )
      }
    })
  }

  ops.push
  ( { op: 'update'
    , path: newpara.path
    , value: newelem
    }
  )
  ops.push
  ( { op: 'select'
    , value: caretSelection ( newpara.path, 0, selection.position )
    }
  )
  return ops
}
