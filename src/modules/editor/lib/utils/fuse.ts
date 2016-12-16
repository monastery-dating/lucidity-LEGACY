import joinText from './joinText'

const fuse = (a, b, c) => Object.assign(
  {}, c || a, { i: joinText(a.i, b.i) }
)
export default fuse
