import fixSelectOrder from './fixSelectOrder'
import inSelection from './inSelection'
import mergeElements from './mergeElements'

const handleStart = (ops, path, elem, selection, islast, backkey) => {
  const offset = selection.anchorOffset
  if (islast) {
    // Edit in same element
    let offsetA = offset
    let offsetB = selection.focusOffset
    if (offsetA === offsetB) {
      if (backkey === 'Backspace') {
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

const handleEnd = (ops, path, elem, selection, backkey) => {
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
export default function deleteSelection (composition, aselection, backkey) {
  const selection = fixSelectOrder(composition, aselection)
  if (!backkey && selection.type === 'Caret') {
    // no selection and no key, nothing to do here
    return null
  }
  const touchedElements = inSelection(composition, selection)
  const ops = []
  let start, end
  touchedElements.forEach(({path, elem}, idx) => {
    if (idx === 0) {
      start = handleStart(
        ops, path, elem, selection,
        idx === touchedElements.length - 1,
        backkey
      )
    } else if (idx === touchedElements.length - 1) {
      end = handleEnd(
        ops, path, elem, selection,
        backkey
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
