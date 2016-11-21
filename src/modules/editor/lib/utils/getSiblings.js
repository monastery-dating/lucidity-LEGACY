import getNeighbours from './getNeighbours'

export default function getSiblings (composition, path) {
  return getNeighbours(composition, path, true)
}
