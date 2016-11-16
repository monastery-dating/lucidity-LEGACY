import inSelection from './inSelection'
import fixSelectOrder from './fixSelectOrder'
import isTextBlock from './isTextBlock'
import makeRef from './makeRef'

const canFuse = (a, b) => (
  isTextBlock(a.elem) && isTextBlock(b.elem) &&
  a.path.length < 3 && b.path.length < 3
)

const fuse = (a, b) => Object.assign(
  {}, a, { i: a.i + b.i }
)

const addDepth = (a) => Object.assign(
  {}, a,
  { i: {
    [makeRef()]: {
      p: 0,
      t: 'T',
      i: a.i
    }
  }}
)

// Note that target === last element in para (can be para itself)
// and that source === first element in para (can be para itself)
const moveInPara = (composition, targetName, source, ref, lastPosition, ops) => {
  const targetPath = [targetName]
  const target = composition.i[targetName]

  if (typeof target.i === 'string') {
    // No children, make first
    ops.push({
      op: 'update',
      path: targetPath,
      value: addDepth(target)
    })
    lastPosition = 0
  }

  ops.push({
    op: 'update',
    path: targetPath.concat([ref]),
    value: Object.assign({}, source, {p: ++lastPosition})
  })
  return lastPosition
}

const mergeElements = (composition, start, end, ops) => {
  // Remove end.update
  ops.pop()
  if (end.path.length === 1) {
    // End is just a simple paragraph, simply fuse or move in start para.
    if (canFuse(start, end)) {
      // Remove start.update
      ops.shift()
      ops.push({
        op: 'update',
        path: start.path,
        value: fuse(start.elem, end.elem)
      })
    } else {
      moveInPara(composition, start.path[0], end.elem, end.path[end.path.length - 1], start.elem.p, ops)
    }
  } else {
    // Move each element from end para inside start para.
    // Make sure to move updated 'end' block
    let lastPosition = start.elem.p
    const endParaPath = end.path.slice(0, 1)
    const children = composition.i[endParaPath[0]].i
    Object.keys(children)
    .sort((a, b) => children[a].p > children[b].p ? 1 : -1)
    .forEach((ref, idx) => {
      let elem = children[ref]
      if (idx === 0) {
        if (canFuse(start, end)) {
          ops.shift()
          ops.push({
            op: 'update',
            path: start.path,
            value: fuse(start.elem, end.elem)
          })
        } else if (end.path.length === 2) {
          elem = end.elem
        } else {
          // Need to write 'end' update inside elem (it's parent)
          elem = Object.assign({}, elem, {i: Object.assign(
            {},
            elem.i,
            {[end.path[end.path.length - 1]]: end.elem}
          )})
        }
      }
      lastPosition = moveInPara(
        composition, start.path[0], elem, ref, lastPosition, ops)
    })
  }
  ops.push({op: 'delete', path: end.path.slice(0, 1)})
}

const handleStart = (ops, path, elem, selection, islast, isbackspace) => {
  const offset = selection.anchorOffset
  if (islast) {
    // Edit in same element
    let offsetA = offset
    let offsetB = selection.focusOffset
    if (offsetA === offsetB) {
      if (isbackspace) {
        offsetA -= 1
        if (offsetA < 0) {
          // FIXME: should move selection before element
          offsetA = 0
        }
      } else {
        offsetB += 1
        if (offsetB > elem.i.length) {
          // FIXME: should move carret to next element
          offsetB = elem.i.length
        }
      }
    }
    const text = elem.i.substr(0, offsetA) +
    elem.i.substr(offsetB)
    ops.push({
      op: 'update',
      path,
      value: Object.assign({}, elem, {i: text})
    })

    ops.push({
      op: 'select',
      path,
      offset: offsetA
    })
  } else if (offset === 0) {
    ops.push({op: 'delete', path})
  } else if (offset >= elem.i.length) {
    // FIXME: ?
    ops.push({
      op: 'select',
      path,
      offset: offset
    })
  } else {
    // remove part
    const text = elem.i.substr(0, offset)
    const value = Object.assign({}, elem, {i: text})
    ops.push({
      op: 'update',
      path,
      value
    })

    ops.push({
      op: 'select',
      path,
      offset: offset
    })
    return {path, elem: value}
  }
  return null
}

const handleEnd = (ops, path, elem, selection, islast, isbackspace) => {
  const offset = selection.focusOffset
  if (offset === 0) {
    // no op
  } else if (offset === elem.i.length) {
    // remove all
    ops.push({op: 'delete', path})
  } else {
    // remove part
    const text = elem.i.substr(offset)
    const value = Object.assign({}, elem, {i: text})
    ops.push({
      op: 'update',
      path,
      value
    })
    return {path, elem: value}
  }
  return null
}

/** Returns the list of operations to remove selected text.
 *
*/
export default function keyBackspace (composition, aselection, isbackspace = true) {
  const selection = fixSelectOrder(composition, aselection)
  const touchedElements = inSelection(composition, selection)
  const ops = []
  let start, end
  touchedElements.forEach(({path, elem}, idx) => {
    if (idx === 0) {
      start = handleStart(
        ops, path, elem, selection,
        idx === touchedElements.length - 1,
        isbackspace
      )
    } else if (idx === touchedElements.length - 1) {
      end = handleEnd(
        ops, path, elem, selection,
        idx === touchedElements.length - 1,
        isbackspace
      )
    } else {
      // remove
      ops.push({op: 'delete', path})
    }
  })

  if (start && end) {
    // Can we merge last with first ?
    mergeElements(composition, start, end, ops)
  }

  return ops
}
