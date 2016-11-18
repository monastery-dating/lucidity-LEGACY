import getPath from './getPath'

export default function getSelection () {
  const selection = global.getSelection()
  const {anchorNode, anchorOffset, focusNode, focusOffset, type} = selection
  const anchorPath = getPath(anchorNode)
  const focusPath = focusNode === anchorNode ? anchorPath : getPath(focusNode)
  console.log(selection, anchorNode, focusNode)
  const anchorValue = anchorNode.textContent
  const focusValue = focusNode.textContent
  return {
    anchorOffset, focusOffset, anchorPath, focusPath,
    anchorValue, focusValue, type
  }
}
