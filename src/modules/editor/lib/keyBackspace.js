import inSelection from './inSelection'
import fixSelectOrder from './fixSelectOrder'

/** Returns the list of operations to remove selected text.
 *
*/
export default function keyBackspace (composition, aselection, isbackspace = true) {
  const selection = fixSelectOrder(composition, aselection)
  const touchedElements = inSelection(composition, selection)
  const ops = []
  touchedElements.forEach(({path, elem}, idx) => {
    if (idx === 0) {
      const offset = selection.anchorOffset
      if (idx === touchedElements.length - 1) {
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
        return {op: 'delete', path}
      } else if (offset >= elem.i.length) {
        // no op
      } else {
        // remove part
        const text = elem.i.substr(0, offset)
        ops.push({
          op: 'update',
          path,
          value: Object.assign({}, elem, {i: text})
        })
      }
    } else if (idx === touchedElements.length - 1) {
      const offset = selection.focusOffset
      if (offset === 0) {
        // no op
      } else if (offset === elem.i.length) {
        // remove all
        ops.push({op: 'delete', path})
      } else {
        // remove part
        const text = elem.i.substr(offset)
        ops.push({
          op: 'update',
          path,
          value: Object.assign({}, elem, {i: text})
        })
      }
    } else {
      // remove
      ops.push({op: 'delete', path})
    }
  })

  return ops
}
