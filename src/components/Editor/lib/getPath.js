
export default function getPath (anchor) {
  const path = []
  let elem = anchor.parentElement
  while (true) {
    const ref = elem.getAttribute('data-ref')
    console.log(ref)
    if (!ref) {
      break
    }
    path.unshift(ref)
    elem = elem.parentElement
  }
  return path.join('.i.')
}
