import extractSelection from './utils/extractSelection'
import rangeSelection from './utils/rangeSelection'
import changeParagraph from './utils/changeParagraph'

const makeOps = ({updated, selected}) => {
  const ops = []
  updated.forEach(({path, elem}) => {
    ops.push({
      op: 'update',
      path,
      value: elem
    })
  })
  if (selected) {
    const first = selected[0]
    const last = selected[selected.length - 1]
    ops.push({
      op: 'select',
      value: rangeSelection(first.path, 0, last.path, last.elem.i.length)
    })
  }
  return ops
}

const SIMPLE_OP = {
  B: true,
  I: true
}

export default function doOperation (composition, selection, op, opts) {
  if (op === 'P') {
    return changeParagraph(composition, selection, opts)
  } else if (SIMPLE_OP[op]) {
    const extracted = extractSelection(composition, selection, op)
    return makeOps(extracted)
  }
  return null
}
