import { ActionContextType } from '../../context.type'
import * as check from 'check-types'

export const loginAction =
( { state
  , input: { username, password, email }
  , services: { data: { authdb } }
  , output
  } : ActionContextType
) => {
  authdb.login
  ( username
  , password
  )
  .then ( ( response ) => {
      output.success ()
    }
  )
  .catch ( ( err ) => {

      if ( err.name === 'unauthorized' ) {
        output.error
        ( { type: 'error'
          , message: `Incorrect username or password.`
          }
        )
      }

      else {
        console.log ( err )
        output.error ( { type: 'error', message: 'Could not login.' } )
      }

    }
  )

}

loginAction [ 'async' ] = true

// Cerebral type checking
loginAction [ 'input' ] =
{ username: check.string
, password: check.string
}
