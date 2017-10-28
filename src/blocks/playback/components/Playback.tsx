import { Signal, State } from 'app'
import { connect, JSX } from 'builder'
import { signal, state } from 'cerebral/tags'
import { styled } from 'styled'

const Result = styled.div`
background: black;
min-height: 100vh;
width: 50vw;
`

interface Props {
  display: typeof State.playback.display
  setDisplay: typeof Signal.playback.setDisplay
}

interface EProps {
  
}

export const Playback = connect < Props, EProps > (
  { display: state`playback.display`
  , setDisplay: signal`playback.setDisplay`
  }
, function Playback ( { display, setDisplay } ) {
    if ( display !== 'hide' ) {
      const onClick = () => setDisplay ( { display: 'hide' } )
      return <Result onClick={ onClick } />
    } else {
      return null
    }
  }
)
