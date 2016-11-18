import fixSelectOrder from './utils/fixSelectOrder'

/** Return toolbox operations related to selection change
*/
export default function doSelect (composition, aselection, ops = []) {
  const selection = fixSelectOrder(composition, aselection)
  if (selection.anchorOffset === 0) {
    if (selection.anchorValue === '\u200B') {
      ops.push({
        op: 'toolbox',
        value: {type: 'ParagraphEmpty'}
      })
    } else {
      ops.push({
        op: 'toolbox',
        value: {type: 'Paragraph'}
      })
    }
  } else if (selection.type === 'Range') {
    ops.push({
      op: 'toolbox',
      value: {type: 'Select'}
    })
  } else {
    ops.push({
      op: 'toolbox',
      value: null
    })
  }
  return ops
}
