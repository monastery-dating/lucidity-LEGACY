import { JSX, connect } from 'builder'
import { state } from 'cerebral/tags'
import { styled, Col, Row } from 'styled'
import { Login } from 'auth'

const Wrapper = styled.div`
display: flex;
&::-webkit-scrollbar { 
  display: none; 
}
flex-direction: ${ ( p: EProps ) => p.direction || 'column' };
`

interface Props {
  loggedIn: boolean
}

interface EProps {
  direction?: 'column' | 'row' | 'column-reverse' | 'row-reverse'
}

export const Auth = connect < Props, EProps > (
  { loggedIn: state`auth.loggedIn`
  }
, function Auth ( { children, direction, loggedIn } ) {
    return (
      <Wrapper data-c='Auth'
        direction={ direction }
        >
        { loggedIn ? children : <Login/> }
      </Wrapper>
    )
  }
)