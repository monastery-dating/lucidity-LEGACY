// We only need to implement going back up with 'render'
const render = function ( ctx
    , child1 = { text: '' }
    , child2 = { text: '' }
    ) {
  console.log ( 'Mixing', ctx, child1, child2 )
  return { text: `${child1.text} ${child2.text}` }
}

export default {
  render
, name: 'Mix'
}
