import { Signal, State } from 'app'
import { connect, JSX } from 'builder'
import { props, signal, state } from 'cerebral/tags'
import { styled } from 'styled'
import { Icon } from 'styled/Icon'

interface Props {
}

interface EProps {
  focused?: boolean
}

const Wrapper = styled.div`
background: #000;
align-self: stretch;
display: flex;
flex-grow: 0;
flex-direction: column;
justify-content: flex-start;
overflow-x: hidden;
overflow-y: auto;
width: 10rem;
`

const Wrap = styled.div`
height: 100%;
background: red;
`

const Element = styled.div`
background: #777;
padding: 3px 8px;
border-bottom: 1px solid #222;
`

const Search = Element.extend`
`
export const Library = connect < Props, EProps > (
  { 
  }
, function Library ( { focused } ) {
    if ( focused ) {
      return (
        <Wrap>
          <Wrapper>
            <Search>
              <Icon icon='search'/>
            </Search>
            <Element>
              three.Cube
            </Element>
            <Element>
              three.Scene
            </Element>
            <Element>
              foo.Bar
            </Element>
            <Element>
              foo.Baz
            </Element>
          </Wrapper>
        </Wrap>
      )
    } else {
      return null
    }
  }
)