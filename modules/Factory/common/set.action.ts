export const setAction = 
( { state
  , input: { path, value }
  }
) => {
  state.set ( path, value )
}
