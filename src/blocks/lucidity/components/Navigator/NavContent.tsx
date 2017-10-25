import { Signal, State } from 'app'
import { connect, JSX } from 'builder'
import { props, signal, state } from 'cerebral/tags'
import { css, styled, Col, Row } from 'styled'
import { Icon } from 'styled/Icon'
import { lighten } from 'polished'

import { Item, ListItem } from './Item'

const List = styled.div`
display: flex;
flex-direction: column;
justify-content: flex-start;
align-items: stretch;
margin: ${ p => p.theme.blockMargin };
margin-top: 0;
padding: ${ p => p.theme.blockMargin };
height: 15rem;
overflow: auto;
background: ${ p => lighten ( 0.4, p.theme.primaryColor ) };
box-shadow: inset 2px 2px 8px rgba(0, 0, 0, 0.2);
`

interface Props {
  groupClicked: typeof Signal.navigation.tabClicked
  data: typeof State.data.Document
}

interface EProps {
  type: string
}

interface Translation {
  [ key: string ]: string
}

export const NavContent = connect < Props, EProps > (
  { groupClicked: signal`navigation.groupClicked`
  , data: state`data.${ props`type` }`
  }
, function NavContent ( { groupClicked, data, type } ) {
    console.log ( type, data )
    const path = `data.${ type }`

    const items = Object.keys ( data )
    .map ( k => data [ k ] )
    .sort ( ( a, b ) => a.title < b.title ? -1 : 1 )

    return (
      <List>
        { items.map
          ( item => <Item key={ item.meta.id } id={ item.meta.id } type={ type } />
          )
        }
      </List>
    )
  }
)
