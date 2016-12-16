export default function resetPosition (children) {
  const result = {}
  let p = 0
  Object.keys(children).sort((a, b) => children[a].p > children[b].p ? 1 : -1).forEach(ref => {
    result[ref] = Object.assign({}, children[ref], {p})
    p += 1
  })
  return result
}
