import { Signal, State } from 'app'
import { connect, JSX } from 'builder'
import { signal, state } from 'cerebral/tags'
import { styled } from 'styled'

interface Props {
}

interface EProps {
  path: string
}

const Wrapper = styled.div`
padding: ${ p => p.theme.blockPaddingV }rem ${ p => p.theme.blockPaddingH }rem;
`

export const CodeDisplay = connect < Props, EProps > (
  { 
  }
, function CodeDisplay ( {  } ) {
    return (
      <Wrapper>THIS IS NEW CODE</Wrapper>
    )    
  }
)