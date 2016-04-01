// We only need to implement going back up with 'render'
const render = function ( ctx
    , child1 = { text: '' }
    , child2 = { text: '' }
    ) {
  return { text: `${child1.text} ${child2.text}` }
}

export default {
  render
, name: 'Mix'
}
