import { ActionContextType } from '../../context.type'
import * as check from 'check-types'

export const logoutAction =
( { state
  , services: { data: { /*authdb*/ } }
  , output
  } : ActionContextType
) => {
  /*
  authdb.logout ()
  .then ( ( response ) => {
      output.success ()
    }
  )
  .catch ( ( err ) => {
      console.log ( err )
      output.error ( { type: 'error', message: 'Could not logout.' } )
    }
  )
  */
}

logoutAction [ 'async' ] = true
