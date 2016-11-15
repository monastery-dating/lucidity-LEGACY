
/* Returns the element at the given path
*/
export default function getAtPath (composition, path) {
  return path.split('.')
  .reduce((current, key) => current[key], composition.i)
}
