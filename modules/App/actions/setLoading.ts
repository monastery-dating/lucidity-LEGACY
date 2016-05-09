export default ( { state, output } ) => {
  state.set ( 'status.type', 'ok' )
  state.set ( 'status.message', 'App reloaded' )
}
