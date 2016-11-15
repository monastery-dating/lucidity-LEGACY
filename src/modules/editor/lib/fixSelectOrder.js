import getPosition from './getPosition'

const aBeforeB = (elemA, elemB, level = 0) => {
  const a = elemA[level]
  const b = elemB[level]
  if (a < b) {
    return true
  } else if (a > b) {
    return false
  } else {
    return aBeforeB(elemA, elemB, level + 1)
  }
}

export default function fixSelectOrder (composition, selection) {
  const {anchorPath, focusPath} = selection
  let reverse = false
  if (anchorPath === focusPath) {
    if (selection.anchorOffset > selection.focusOffset) {
      reverse = true
    }
  } else {
    const anchorPosition = getPosition(composition, anchorPath).concat([-1, -1])
    const focusPosition = getPosition(composition, focusPath).concat([Infinity, Infinity])
    reverse = !aBeforeB(anchorPosition, focusPosition)
  }

  if (reverse) {
    return {
      anchorPath: focusPath,
      anchorOffset: selection.focusOffset,
      focusPath: anchorPath,
      focusOffset: selection.anchorOffset
    }
  } else {
    return selection
  }
}
