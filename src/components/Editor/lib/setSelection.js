export default function setSelection (node, stringPath) {
  const selection = global.selection
  if (node && selection && stringPath === selection.anchorPath) {
    console.log(node)
    const textNode = node.childNodes[0]
    const range = document.createRange()
    range.setStart(textNode, selection.anchorOffset)
    range.setEnd(textNode, selection.focusOffset)

    const sel = window.getSelection()
    sel.removeAllRanges()
    sel.addRange(range)
    global.selection = null
  }
}
