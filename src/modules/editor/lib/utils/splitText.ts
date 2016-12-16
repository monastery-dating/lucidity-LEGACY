export default function splitText (text, start, theEnd) {
  const end = theEnd === undefined ? start : theEnd
  const before = text.substr(0, start)
  const inside = text.substr(start, end - start)
  const after = text.substr(end)
  return {before, inside, after}
}
