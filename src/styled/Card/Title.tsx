import { connect, JSX } from 'builder'
import { styled, Col, Row } from 'styled'
import { translate, Translate } from 'config/translate'

import { Icon } from '../Icon'

const Text = Col.extend`
margin: ${ p => p.theme.blockMargin };
`

interface Props {
  translate: Translate
}

interface Eprops {
  className?: string
  name: string
  icon?: boolean
}

const TheIcon = styled(Icon)`
  text-align: center;
`

export const TitleComponent = connect < Props, Eprops > (
  { translate
  }
, function TheTitle ( { children, className, icon, name, translate } ) {
    return (
      <Row className={ className }>
        <Text xs={true}>
          { icon ? <TheIcon icon={ name } /> : '' }
          { translate ( name, 'Title' ) }
          { children }
        </Text>
      </Row>
    )
  }
)

export const Title = styled(TitleComponent)`
background: ${ props => props.theme.primaryColor };
border: ${ p => p.theme.border };
border-bottom: none;
border-top-left-radius: ${ props => props.theme.borderRadius }px;
border-top-right-radius: ${ props => props.theme.borderRadius }px;
box-shadow: ${ p => p.theme.boxShadow };
color: ${ props => props.theme.primaryColorFg };
position: relative;
text-align: left;
`

export const Message = styled(TitleComponent)`
background: ${ props => props.theme.primaryColor };
border: ${ p => p.theme.border };
border-radius: ${ p => p.theme.borderRadius}px;
box-shadow: ${ p => p.theme.boxShadow };
color: ${ props => props.theme.primaryColorFg };
text-align: left;
`
