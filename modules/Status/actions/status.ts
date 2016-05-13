interface StatusType {
  type: string
  message: string
}

export const status =
( { state, input } ) => {
  const s: StatusType = input.status

  const status = state.get ( '$status' ) || []
  state.set ( '$status', [ s, ...status ] )
}

// FIXME do we need this ?
export const setStatus = ( s: StatusType ) => {
  return ( { state } ) => {
    const status = state.get ( '$status' ) || []
    state.set ( '$status', [ s, ...status ] )
  }
}
