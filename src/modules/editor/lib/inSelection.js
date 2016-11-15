import getPosition from './getPosition'

/* Return an ordered array of all paths inside the selection.
 * If a block is partially inside a selection, only affected
 * parts of the block (spans) will be returned.
 */
export default function inSelection (composition, selection) {
  const {anchorPath, focusPath} = selection

  const anchorPosition = getPosition(composition, anchorPath)
  const focusPosition = getPosition(composition, focusPath)

  const result = []
  extractPaths(
    composition.i,
    // Any missing level is "start is smaller"
    anchorPosition.concat([-1, -1]),
    // Any missing level is "end is bigger"
    focusPosition.concat([Infinity, Infinity])
    , 0
    , ''
    , result
  )
  return result
}

const extractPaths = (elements, startPosition, endPosition, level, path, result) => {
  const start = startPosition[level]
  const end = endPosition[level]
  Object.keys(elements)
  .sort((a, b) => elements[a].p > elements[b].p ? 1 : -1)
  .forEach(ref => {
    const elem = elements[ref]
    if (elem.p < start || elem.p > end) {
      // ignore
    } else if (elem.p > start && elem.p < end) {
      // completely inside selection
      result.push({path: path + ref, elem})
    } else if (typeof elem.i === 'string') {
      result.push({path: path + ref, elem})
    } else {
      extractPaths(elem.i, startPosition, endPosition, level + 1, path + ref + '.i.', result)
    }
  })
}
