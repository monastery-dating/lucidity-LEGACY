import { ActionContextType } from '../../context.type'
import * as check from 'check-types'

export const signupAction =
( { state
  , input: { username, password, email }
  , services: { data: { authdb } }
  , output
  } : ActionContextType
) => {
  authdb.signup
  ( username
  , password
  , { email }
  )
  .then ( ( response ) => {
      output.success ()
    }
  )
  .catch ( ( err ) => {

      if ( err.name === 'conflict' ) {
        output.error
        ( { type: 'error'
          , message: `Username '${username}' already exists, choose another username.`
          }
        )
      }

      else if ( err.name === 'forbidden' ) {
        output.error
        ( { type: 'error'
          , message: `Invalid username '${username}'.`
          }
        )
      }

      else {
        console.log ( err )
        output.error ( { type: 'error', message: 'Could not signup.' } )
      }

    }
  )

}

signupAction [ 'async' ] = true

// Cerebral type checking
signupAction [ 'input' ] =
{ username: check.string
, password: check.string
, email: check.string
}
