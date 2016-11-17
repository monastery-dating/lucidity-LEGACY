export default function splitText (text, loc) {
  const before = text.substr(0, loc).trimRight()
  const after = text.substr(loc).trimLeft()
  return {before, after}
}
