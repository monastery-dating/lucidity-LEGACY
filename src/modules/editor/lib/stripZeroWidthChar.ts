
export default function stripZeroWidthChar
( avalue
, aselection
) : { value: string, selection?: any } {
  let value = avalue
  const idx = value.indexOf('\u200B')
  if (idx >= 0) {
    value = value.substr(0, idx) + value.substr(idx + 1)
    let selection = aselection
    if (selection.anchorOffset > idx) {
      const offset = selection.anchorOffset - 1
      selection = Object.assign(
        {}, selection, {anchorOffset: offset, focusOffset: offset}
      )
      return {value, selection}
    } else {
      // Must reset selection anyway
      return {value, selection}
    }
  }
  return {value}
}
