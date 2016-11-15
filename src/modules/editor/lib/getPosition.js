
/* Return an array with position at each level in path.
*/
export default function getPosition (composition, path) {
  const parts = path.split('.i.')
  let currentElement = composition
  return parts.map(ref => {
    currentElement = currentElement.i[ref]
    return currentElement.p
  })
}
