import { Signal, State } from 'app'
import { connect, JSX } from 'builder'
import { props, signal, state } from 'cerebral/tags'
import { translate, Translate } from 'config/translate'
import { Data } from 'data'
import { css, styled, Col, Row } from 'styled'
import { Icon } from 'styled/Icon'

interface Props {
  selectItem: typeof Signal.navigation.selectItem
  title: Data [ 'title' ]
  translate: Translate
}

interface Eprops {
  id: string
  type: string
}

export const ListItem = styled.div`
cursor: pointer;
padding: 5px 0;
text-align: left;
`

export const Item = connect < Props, Eprops > (
  { selectItem: signal`navigation.selectItem`
  , title: state`data.${ props`type` }.${ props`id` }.title`
  , translate
  }
, function Item ( { id, selectItem, title, translate, type } ) {
    const showTitle = ( ! title || title === '') ? translate ( 'NoTitle' ) : title

    return (
      <ListItem>
        <a onClick={ () => selectItem ( { type, id } ) }>
          <Icon icon={ type } />
          { showTitle }
        </a>
      </ListItem>
    )
  }
)