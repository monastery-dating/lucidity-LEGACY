import * as check from 'check-types'
import { ActionContextType } from '../../context.type'

export const changedAction =
( { state
  , input: { type, message }
  , output
  } : ActionContextType
) => {

  if ( type === 'error' ) {
    output.error ( { status: { type, message } } )
  }

  else {
    state.set ( [ '$filestorage', 'status' ], type )
    output.success ()
  }

}

// Cerebral type checking
changedAction [ 'input' ] = ( k ) =>
(  check.string ( k.type )
&& check.maybe.string ( k.message )
)
