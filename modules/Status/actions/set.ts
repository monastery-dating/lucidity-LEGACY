interface StatusType {
  type: string
  message: string
}
export default
( { state, input } ) => {
  const s: StatusType =
  { type: input.type, message: input.message }

  const status = state.get ( '$status' ) || []
  state.set ( '$status', [ s, ...status ] )
}

export const setStatus = ( s: StatusType ) => {
  return ( { state } ) => {
    const status = state.get ( '$status' ) || []
    state.set ( '$status', [ s, ...status ] )
  }
}
