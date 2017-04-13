
/* Return an array with position at each level in path.
*/
export function getPosition (composition, path) {
  let currentElement = composition
  return path.map(ref => {
    currentElement = currentElement.i[ref]
    return currentElement.p
  })
}
