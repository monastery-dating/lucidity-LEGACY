import inSelection from './inSelection'
import splitText from './splitText'
import makeRef from './makeRef'

const OP = 'B'

export default function applyB (composition, selection) {
  const ops = []
  const touchedElements = inSelection(composition, selection)
  if (touchedElements.length === 1 && touchedElements[0].path.length === 1) {
    // simple paragraph without any markup
    const {elem, path} = touchedElements[0]
    const {before, inside, after} = splitText(elem.i, selection.anchorOffset, selection.focusOffset)
    const children = {}
    let lastPosition = -1
    if (before.length > 0) {
      children[makeRef()] = {p: ++lastPosition, t: 'T', i: before}
    }
    if (inside.length > 0) {
      children[makeRef()] = {p: ++lastPosition, t: OP, i: inside}
    }
    if (after.length > 0) {
      children[makeRef()] = {p: ++lastPosition, t: 'T', i: after}
    }
    const newelem = Object.assign({}, elem, {i: children})
    ops.push({
      op: 'update',
      path,
      value: newelem
    })
  }
  return ops
}
