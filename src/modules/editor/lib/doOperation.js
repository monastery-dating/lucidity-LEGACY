import applyB from './utils/applyB'

const APPLY_OP = {
  B: applyB
}

export default function doOperation (op, composition, selection) {
  const apply = APPLY_OP[op]
  if (apply) {
    return apply(composition, selection)
  }
  return null
}
