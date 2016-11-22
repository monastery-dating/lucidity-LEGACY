import extractSelection from './utils/extractSelection'

const makeOps = (extracted) => {
  const ops = []
  extracted.updated.forEach(({path, elem}) => {
    ops.push({
      op: 'update',
      path,
      value: elem
    })
  })
  return ops
}

const SIMPLE_OP = {
  B: true,
  I: true
}

export default function doOperation (composition, selection, op) {
  if (SIMPLE_OP[op]) {
    const extracted = extractSelection(composition, selection, op)
    return makeOps(extracted)
  }
  return null
}
