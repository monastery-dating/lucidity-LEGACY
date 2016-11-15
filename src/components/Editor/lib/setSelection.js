export default function setSelection (node, stringPath) {
  const selection = global.selection
  if (node && selection && stringPath === selection.path) {
    const textNode = node.childNodes[0]
    const range = document.createRange()
    range.setStart(textNode, selection.offset)
    range.setEnd(textNode, selection.offset)

    const sel = window.getSelection()
    sel.removeAllRanges()
    sel.addRange(range)
    global.selection = null
  }
}
