export default function caretSelection (path, offset) {
  return {
    anchorPath: path,
    anchorOffset: offset,
    type: 'Caret'
  }
}
