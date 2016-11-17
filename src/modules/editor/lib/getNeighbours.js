import getAtPath from './getAtPath'

const SortAscending = (children) => (
  Object.keys(children).sort(
    (a, b) => children[a].p > children[b].p ? 1 : -1
  )
)

const SortDescending = (children) => (
  Object.keys(children).sort(
    (a, b) => children[a].p > children[b].p ? -1 : 1
  )
)

const getChild = (obj, sorter) => {
  const children = obj.elem.i
  if (typeof children === 'string') {
    return obj
  }
  const sortedRefs = sorter(children)
  const ref = sortedRefs[0]
  const path = obj.path.concat([ref])
  const elem = children[ref]
  if (typeof elem.i !== 'string') {
    // go further down
    return getChild({path, elem}, sorter)
  }
  return {path, elem}
}

const getFirstChild = (obj) => {
  return getChild(obj, SortAscending)
}

const getLastChild = (obj) => {
  return getChild(obj, SortDescending)
}

/* Return two closest DOM neighbours (if found). [previous, next]
 */
export default function getNeighbours (composition, path, onlySibling = false) {
  if (path.length === 0) {
    // This is root, no siblings
    return [null, null]
  }
  const ref = path[path.length - 1]
  const parentPath = path.slice(0, path.length - 1)
  const parent = getAtPath(composition, parentPath)
  const children = parent.i
  const sortedRefs = Object.keys(children).sort((a, b) => children[a].p > children[b].p ? 1 : -1)
  const idx = sortedRefs.indexOf(ref)
  let prevSibling, nextSibling

  const prevSiblingRef = sortedRefs[idx - 1]
  if (prevSiblingRef) {
    prevSibling = {
      path: parentPath.concat([prevSiblingRef]),
      elem: children[prevSiblingRef]
    }
    if (!onlySibling) {
      prevSibling = getLastChild(prevSibling)
    }
  }

  const nextSiblingRef = sortedRefs[idx + 1]
  if (nextSiblingRef) {
    nextSibling = {
      path: parentPath.concat([nextSiblingRef]),
      elem: children[nextSiblingRef]
    }
    if (!onlySibling) {
      nextSibling = getFirstChild(nextSibling)
    }
  }

  if (!prevSibling || !nextSibling) {
    // get uncles
    const uncles = getNeighbours(composition, parentPath)
    if (!prevSibling && uncles[0]) {
      prevSibling = getLastChild(uncles[0])
    }
    if (!nextSibling && uncles[1]) {
      nextSibling = getFirstChild(uncles[1])
    }
  }
  return [prevSibling, nextSibling]
}

export function getSiblings (composition, path) {
  return getNeighbours(composition, path, true)
}
