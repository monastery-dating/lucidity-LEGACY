import isTextBlock from './isTextBlock'

const canFuse = (a, b) => (
  isTextBlock(a.elem) && isTextBlock(b.elem) &&
  a.path.length < 3 && b.path.length < 3
)
export default canFuse
