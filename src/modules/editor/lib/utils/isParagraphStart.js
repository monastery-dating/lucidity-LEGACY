import getPosition from './getPosition'

export default function isParagraphStart (composition, path, offset, anchorValue) {
  if (anchorValue === '\u200B') {
    return true
  }
  if (offset > 0) {
    return false
  }
  if (path.length === 1) {
    return true
  }
  return getPosition(composition, path).slice(1).reduce((sum, p) => sum + p, 0) === 0
}
