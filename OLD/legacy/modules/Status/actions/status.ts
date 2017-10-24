import { ActionContextType, StateType } from '../../context.type'
import { setDetail } from './toggleDetail'

// History will never grow beyond this
export const MAX_STATUS_HISTORY = 250
// When history gets to MAX, we shrink to MIN
export const MIN_STATUS_HISTORY = 200
export const HISTORY_PATH = [ '$status', 'list' ]

export interface StatusType {
  type: string
  message: string
  // unique ref in status list (used as id to show/hide detail)
  ref?: number
  detail?: string[]
}

let ref = 0

// Used during testing only
export const resetRef = () => { ref = 0 }

const addStatus =
( state: StateType
, status: StatusType
) : StatusType => {
  const curr = state.get ( HISTORY_PATH ) || []
  ref += 1
  const s = Object.assign ( {}, status, { ref } )
  let list = [ s, ...curr ]
  if ( list.length > MAX_STATUS_HISTORY ) {
    list = list.slice ( 0, MIN_STATUS_HISTORY )
  }
  state.set ( HISTORY_PATH, list )
  return s
}

export const status =
( { state, input, output }: ActionContextType ) => {
  if ( input.status ) {
    const s = addStatus ( state, input.status )

    if ( s.type === 'error' ) {
      // Automatically open on error
      setDetail ( state, s )
    }
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
export const setStatus = ( status: StatusType ) => {
  return ( { state }: ActionContextType ) => {
    addStatus ( state, status )
  }
}
