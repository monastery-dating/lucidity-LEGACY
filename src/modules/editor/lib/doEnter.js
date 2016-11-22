import deleteSelection from './utils/deleteSelection'
import {extractPaths, BIGGEST_PATH, SMALLEST_PATH} from './utils/inSelection'
import caretSelection from './utils/caretSelection'
import getPosition from './utils/getPosition'
import isTextBlock from './utils/isTextBlock'
import makeRef from './utils/makeRef'
import newParagraph from './utils/newParagraph'
import splitText from './utils/splitText'

/** Returns the list of operations after enter pressed.
 *
 */
export default function doEnter (composition, selection) {
  let ops = deleteSelection(composition, selection)

  let {anchorPath, anchorOffset} = selection
  if (ops) {
    const selectOp = ops.find(op => op.op === 'select')
    if (selectOp) {
      anchorPath = selectOp.anchorPath
      anchorOffset = selectOp.anchorOffset
    }
  } else {
    ops = []
  }

  const parentPath = anchorPath.slice(0, 1)
  const parent = composition.i[parentPath[0]]
  // 1. Create new paragraph
  const newpara = newParagraph(composition, {path: parentPath, elem: parent})
  const newelem = newpara.elem
  if (typeof parent.i === 'string') {
    // Split text.
    if (anchorOffset < parent.i.length) {
      const {before, after} = splitText(parent.i, anchorOffset)
      ops.push({
        op: 'update',
        path: parentPath,
        value: Object.assign({}, parent, {i: before.trimRight()})
      })
      newelem.i = after.trimLeft()
    }
    // No child to move.
  } else {
    const anchorPosition = getPosition(composition, anchorPath)
    // 2. Collect end of paragraph
    // TODO: move this in separate function
    const touchedElements = []
    let lastPosition = -1
    extractPaths(
      parent.i,
      // Any missing level is "start is smaller"
      anchorPosition.concat(SMALLEST_PATH),
      // Any missing level is "end is bigger"
      BIGGEST_PATH
      , 1
      , parentPath
      , touchedElements
    )
    touchedElements.forEach(({path, elem}, idx) => {
      if (idx === 0) {
        if (anchorOffset < elem.i.length) {
          const {before, after} = splitText(elem.i, anchorOffset)
          ops.push({
            op: 'update',
            path,
            value: Object.assign({}, elem, {i: before.trimRight()})
          })
          newelem.i = after.trimLeft()
        }
      } else if (idx === 1 && isTextBlock(elem)) {
        // fuse with newelem
        Object.assign(newelem, {i: newelem.i + elem.i})
        ops.push({
          op: 'delete',
          path
        })
      } else {
        // TODO: extract and use moveInPara from deleteSelection
        if (typeof newelem.i === 'string') {
          newelem.i = {
            [makeRef()]: {
              t: 'T',
              p: ++lastPosition,
              i: newelem.i
            }
          }
        }
        newelem.i[path[path.length - 1]] = Object.assign(
          {}, elem, {p: ++lastPosition}
        )
        ops.push({
          op: 'delete',
          path
        })
      }
    })
  }

  ops.push({
    op: 'update',
    path: newpara.path,
    value: newelem
  })
  ops.push({
    op: 'select',
    value: caretSelection(newpara.path, 0)
  })
  return ops
}
