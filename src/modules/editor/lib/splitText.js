export default function splitText (text, loc) {
  const before = text.substr(0, loc).trim()
  const after = text.substr(loc).trim()
  return {before, after}
}
