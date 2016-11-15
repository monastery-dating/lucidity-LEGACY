import inSelection from './inSelection'

/** Returns the list of operations to remove selected text.
 *
*/
export default function deleteSelection (composition, selection) {
  if (selection.hasSelection === false) {
    return []
  }
  const touchedElements = inSelection(composition, selection)
  return touchedElements.map(({path, elem}, idx) => {
    if (idx === 0) {
      const offset = selection.anchorOffset
      if (idx === touchedElements.length - 1) {
        // Edit in same element
        const text = elem.i.substr(0, offset) +
                     elem.i.substr(selection.focusOffset)
        return {
          op: 'update',
          path,
          value: Object.assign({}, elem, {i: text})
        }
      } else if (offset === 0) {
        return {op: 'delete', path}
      } else if (offset >= elem.i.length) {
        // no op
        return {op: 'noop', path}
      } else {
        // remove part
        const text = elem.i.substr(0, offset)
        return {
          op: 'update',
          path,
          value: Object.assign({}, elem, {i: text})
        }
      }
    } else if (idx === touchedElements.length - 1) {
      const offset = selection.focusOffset
      if (offset === 0) {
        // no op
        return {op: 'noop', path}
      } else if (offset === elem.i.length) {
        // remove all
        return {op: 'delete', path}
      } else {
        // remove part
        const text = elem.i.substr(offset)
        return {
          op: 'update',
          path,
          value: Object.assign({}, elem, {i: text})
        }
      }
    } else {
      // remove
      return {op: 'remove', path}
    }
  })
}
