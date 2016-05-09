export default ( ms ) => {
  const wait = ( { output } ) => {
    setTimeout
    ( () => output.success ()
    , ms
    )
  }

  wait['async'] = true

  return [ wait, { success: [] } ]
}
