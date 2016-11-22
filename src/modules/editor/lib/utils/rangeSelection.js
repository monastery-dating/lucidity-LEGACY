export default function rangeSelection (anchorPath, anchorOffset, focusPath, focusOffset) {
  return {
    anchorPath,
    anchorOffset,
    focusPath,
    focusOffset,
    type: 'Range'
  }
}
