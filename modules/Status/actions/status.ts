import { ContextType } from '../../context.type'

export const status =
( { state, input }: ContextType ) => {
  if ( input.status ) {
    const status = state.get ( '$status' ) || []
    state.set ( '$status', [ input.status, ...status ] )
  }
}

// Cerebral type checking
//status [ 'input' ] =
//{ status:
//  { type: String
//  , message: String
//  }
//}

// FIXME do we need this ?
interface StatusType {
  type: string
  message: string
}
export const setStatus = ( s: StatusType ) => {
  return ( { state }: ContextType ) => {
    const status = state.get ( '$status' ) || []
    state.set ( '$status', [ s, ...status ] )
  }
}
