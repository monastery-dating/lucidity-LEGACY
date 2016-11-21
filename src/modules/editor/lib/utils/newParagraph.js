import getSiblings from './getSiblings'
import makeRef from './makeRef'

const positionBetween = (a, b) => {
  if (b) {
    return a.elem.p + (b.elem.p - a.elem.p) / 2
  } else {
    return a.elem.p + 1
  }
}

export default function newParagraph (composition, prev) {
  const siblings = getSiblings(composition, prev.path)
  const p = positionBetween(prev, siblings[1])
  const elem = {
    p, t: 'P', i: ''
  }
  const path = [makeRef()]
  return {path, elem}
}
