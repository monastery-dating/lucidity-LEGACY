import getPath from './getPath'

export default function getSelection () {
  const selection = global.getSelection()
  const {anchorNode, anchorOffset, focusNode, focusOffset} = selection
  const anchorPath = getPath(anchorNode)
  const focusPath = focusNode === anchorNode ? anchorPath : getPath(focusNode)
  const anchorValue = anchorNode.textContent
  const focusValue = focusNode.textContent
  const hasSelection = anchorNode !== focusNode || anchorOffset !== focusOffset
  return {
    anchorOffset, focusOffset, anchorPath, focusPath,
    anchorValue, focusValue, hasSelection
  }
}
