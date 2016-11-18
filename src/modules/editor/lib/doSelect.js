import fixSelectOrder from './utils/fixSelectOrder'

/** Return toolbox operations related to selection change
*/
export default function doSelect (composition, aselection, ops = []) {
  const selection = fixSelectOrder(composition, aselection)
  if (selection.anchorOffset === 0) {
    if (selection.anchorValue === '\u200B') {
      ops.push({
        op: 'toolbox',
        value: {type: 'para.empty'}
      })
    } else {
      ops.push({
        op: 'toolbox',
        value: {type: 'para'}
      })
    }
  } else if (selection.noSelection) {
    ops.push({
      op: 'toolbox',
      value: null
    })
  } else {
    ops.push({
      op: 'toolbox',
      value: {type: 'select'}
    })
  }
  return ops
}
