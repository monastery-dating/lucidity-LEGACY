import getPath from './getPath'

export default function getSelection () {
  const selection = global.getSelection()
  const {anchorNode, anchorOffset, focusNode, focusOffset, type} = selection
  const anchorPath = getPath(anchorNode)
  const focusPath = focusNode === anchorNode ? anchorPath : getPath(focusNode)
  const anchorValue = anchorNode.textContent
  const focusValue = focusNode.textContent
  const rects = selection.getRangeAt(0).getClientRects()

  let last = rects[rects.length - 1]
  if (type === 'Caret') {
    return {
      anchorPath, anchorOffset, type,
      anchorValue,
      end: {
        top: last.top,
        left: last.left + last.width
      }
    }
  }
  let first = rects[0]
  if (first.top > last.top ||
      (first.top === last.top &&
        (first.left > last.left ||
          (anchorNode === focusNode && anchorOffset > focusOffset)
        )
      )
     ) {
    // reverse
    console.log('REVERSE')
    return {
      anchorOffset: focusOffset,
      focusOffset: anchorOffset,
      anchorPath: focusPath,
      focusPath: anchorPath,
      anchorValue: focusValue,
      focusValue: anchorValue,
      type, end: {
        top: first.top,
        left: first.left + first.width
      }
    }
  } else {
    return {
      anchorOffset, focusOffset, anchorPath, focusPath,
      anchorValue, focusValue, type, end: {
        top: last.top,
        left: last.left + last.width
      }
    }
  }
}
