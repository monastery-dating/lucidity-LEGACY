
/* Returns the element at the given path
*/
export default function getAtPath (composition, path) {
  return path
  .reduce((current, key) => current.i[key], composition)
}
