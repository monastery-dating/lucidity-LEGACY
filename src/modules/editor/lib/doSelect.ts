import isParagraphStart from './utils/isParagraphStart'

/** Return toolbox operations related to selection change
*/
export default function doSelect (composition, selection, ops = []) {
  const {type, anchorPath, anchorOffset, anchorValue, end} = selection

  if (type === 'Caret' && isParagraphStart(composition, anchorPath, anchorOffset, anchorValue)) {
    if (anchorValue === '\u200B') {
      ops.push({
        op: 'toolbox',
        value: {type: 'ParagraphEmpty', position: end}
      })
    } else {
      ops.push({
        op: 'toolbox',
        value: {type: 'Paragraph', position: end}
      })
    }
  } else if (type === 'Range') {
    ops.push({
      op: 'toolbox',
      value: {type: 'Select', position: end}
    })
  } else {
    ops.push({
      op: 'toolbox',
      value: null
    })
  }
  return ops
}
