const init = function () {
  // Just to test 'init'
  this.text = ' and I am happy'
}

// We only need to implement going back up with 'render'
const render = function ( ctx, child = { text: '' } ) {
  const text =
  child.text
  .split ( '' )
  .reverse ()
  .join ( '' ) + this.text

  return { text }
}

export default {
  init
, render
, name: 'Reverse'
}

