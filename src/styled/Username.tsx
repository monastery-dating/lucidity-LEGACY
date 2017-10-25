import { Signal, State } from 'app'
import { JSX, connect } from 'builder'
import { signal, state } from 'cerebral/tags'
import { styled, Col, Row } from 'styled'
import { Icon } from 'styled/Icon'

interface Props {
  email: typeof State.auth.user.email
  displayName: typeof State.prefs.displayName
  loggedIn: typeof State.auth.loggedIn
  logout: typeof Signal.auth.logout
}

export const Name = styled.div`
`

export const Username = connect < Props > (
  { email: state`auth.user.email`
  , displayName: state`prefs.displayName`
  , loggedIn: state`auth.loggedIn`
  , logout: signal`auth.logout`
  }
, function Username ( { email, displayName, loggedIn, logout } ) {
    if ( loggedIn ) {
      return (
        <div onClick={ () => logout () }>
          <Name>{ displayName || email }</Name>
          <Icon icon='Logout' />
        </div>
      )
    } else {
      return null
    }
  }
)
