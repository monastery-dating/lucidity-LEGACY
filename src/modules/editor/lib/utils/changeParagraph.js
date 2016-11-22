import getAtPath from './getAtPath'

export default function doParagraph (composition, selection, opts) {
  const path = selection.anchorPath.slice(0, 1)
  const elem = getAtPath(composition, path)
  const value = Object.assign({}, elem, {o: opts})
  if (!opts) {
    delete value.o
  }
  return [
    {
      op: 'update',
      path,
      value
    },
    {op: 'select', value: selection}
  ]
}
