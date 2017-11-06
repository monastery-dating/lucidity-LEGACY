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


const Lib = styled.div`
display: flex;
flex-direction: column;
`

const List = styled.div`
background: #000;
display: flex;
flex-direction: column;
justify-content: flex-start;
position: absolute;
`

const Scroller = styled.div`
flex-grow: 1;
overflow-x: hidden;
overflow-y: scroll;
position: relative;
width: 316px;

::-webkit-scrollbar-track {
  background-color: #777;
  border-left: 1px solid #222;
}

::-webkit-scrollbar {
	width: 10px;
	background-color: #777;
}

::-webkit-scrollbar-thumb {
  border-radius: 2px;
	background-color: #000;
}
`

const Element = styled.div`
background: #777;
padding: 3px 8px;
border-bottom: 1px solid #222;
width: 300px;
`

const Search = Element.extend`
`

function scrollStop ( e: any ) {
  // el.scrollTop -= e.wheelDeltaY
  const delta = e.type === 'mousewheel'
    ? e.wheelDelta
    : e.detail * -40
  if ( delta < 0 && ( this.scrollHeight - this.offsetHeight - this.scrollTop ) <= 0 ) {
    this.scrollTop = this.scrollHeight
    e.preventDefault ()
  } else if ( delta > 0 && delta > this.scrollTop ) {
    this.scrollTop = 0
    e.preventDefault ()
  }
}

export const Library = connect < Props, EProps > (
  { 
  }
, function Library ( { focused } ) {
    if ( focused ) {
      function setupScroll ( el: HTMLDivElement ) {
        el.addEventListener ( 'mousewheel', scrollStop )
        el.addEventListener ( 'DOMMouseScroll', scrollStop )
      }
      return (
        <Lib>
          <Search>
            <Icon icon='search'/>
          </Search>
          <Scroller innerRef={ setupScroll }>
            <List>
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
            </List>
          </Scroller>
        </Lib>
      )
    } else {
      return null
    }
  }
)