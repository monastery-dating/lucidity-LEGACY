export const debounce = ( ms: number ) => {
  let done
  let last

  const doit = () => {
    if ( done && Date.now () - last >= ms ) {
      done ()
      done = null
    }
  }
  const action = ( { output } ) => {
    done = () => {
      output ()
    }
    last = Date.now ()
    setTimeout ( doit, ms )
  }
  action [ 'async' ] = true
  return action
}
