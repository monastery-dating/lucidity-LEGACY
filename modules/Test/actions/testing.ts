export default ( { state, output } ) => {
  state.set ( 'status.type', 'info' )
  state.set ( 'status.message', 'Running tests' )
}
