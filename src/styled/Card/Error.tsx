import { connect, JSX } from 'builder'
import { props, state } from 'cerebral/tags'
import { styled, Col, Row } from 'styled'
import { translate, Translate } from 'config/translate'

import { Icon } from '../Icon'


export const Text = Col.extend`
background: ${ props => props.theme.errorColor };
border-radius: ${ props => props.theme.borderRadius }px;
color: ${ props => props.theme.color };
padding: ${ p => p.theme.blockPaddingH}rem ${ p => p.theme.blockPaddingV}rem;
`

interface Props {
  error: string | undefined
  translate: Translate
}

interface Eprops {
  className?: string
  path: string
  icon?: boolean
}

const TheIcon = styled(Icon)`
  text-align: center;
`

export const ErrorComponent = connect < Props, Eprops > (
  { error: state`${ props`path` }`
  , translate
  }
, function TheError ( { className, error, icon, translate } ) {
    return error
      ? <Row className={ className }>
          <Text xs={true}>
            { icon ? <TheIcon icon={ error } /> : '' }
            { translate ( error, 'Error' ) }
          </Text>
        </Row>
      : null
  }
)

export const Error = styled(ErrorComponent)`
margin: ${ p => p.theme.blockMargin };
text-align: left;
`
