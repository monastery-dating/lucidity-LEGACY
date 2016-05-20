import { ActionContextType, StateType } from '../../context.type'
import { StatusType } from './status'

export const setDetail =
( state: StateType, status: StatusType ) => {
  const visible = state.get ( [ '$status', 'detail', 'visible' ] )
  const curr = state.get ( [ '$status', 'detail' ] )
  if ( curr.ref === status.ref ) {
    // toggle
    state.set
    ( [ '$status', 'showDetail' ]
    , !state.get ( [ '$status', 'showDetail' ] )
    )
  }
  else {
    // display
    state.set ( [ '$status', 'detail' ], status )
    state.set ( [ '$status', 'showDetail' ], true )
  }
}

export const toggleDetail =
( { state, input }: ActionContextType ) => {
  setDetail ( state, input.detail )
}
