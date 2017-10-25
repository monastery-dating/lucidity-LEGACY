import { JSX, connect } from 'builder'
import { state } from 'cerebral/tags'
import { Col, Row } from 'styled'
import { Login } from 'auth'

const FullRow = Row.extend`
  flex-grow: 1;
  overflow: auto;
  padding-top: 2rem;
  &::-webkit-scrollbar { 
    display: none; 
  }
`

interface Props {
  loggedIn: boolean
}

export const Auth = connect < Props > (
  { loggedIn: state`auth.loggedIn`
  }
, function Auth ( { children, loggedIn } ) {
    return loggedIn
      ? <FullRow data-c='Auth'>{ children }</FullRow>
      : <FullRow data-c='Auth'><Login /></FullRow>
  }
)