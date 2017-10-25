import { State } from 'app'
import { connect, JSX } from 'builder'
import { props, signal } from 'cerebral/tags'
import { translate, Translate } from 'config/translate'
import { darken, lighten } from 'polished'
import { css, styled, Col, Row } from 'styled'
import { Theme } from 'styled/theme'
import { Icon } from 'styled/Icon'

interface Props {
  click (): void  
  translate: Translate
}

interface BtnProps {
  large?: boolean
  primary?: boolean
}

interface EProps extends BtnProps {
  className?: string
  icon?: boolean
  name: string
  onClick: string
}


const Btn = connect < Props, EProps > (
  { click: signal`${ props`onClick` }`
  , translate
  }
, function Button ( { className, click, icon, large, name, translate } ) {
    return (
      <Col>
        <button
          className={ className }
          onClick={ () => click () }
          >
          { icon ? <Icon icon={ name } large={ large } /> : '' }
          { translate ( name, 'Btn' ) }
        </button>
      </Col>
    )
  }
)

export const Button = styled(Btn)`
text-align: left;
background: ${ ( p: BtnProps & { theme: Theme } ) => p.primary
  ? p.theme.primaryColor
  : p.theme.secondaryColor
};
border: none;
border-radius: ${ p => 2 * p.theme.borderRadius }px;
color: ${ p => p.primary
  ? p.theme.primaryColorFg
  : p.theme.secondaryColorFg
};
cursor: pointer;
font-size: inherit;
margin: ${ props => props.theme.blockMargin };
text-align: center;
${ props => props.large ? css`
min-width: 12rem;
padding: ${ props => 1.5 * props.theme.blockPaddingV }rem ${ props => 1.5 * props.theme.blockPaddingH }rem;
` : css`
min-width: 7rem;
padding: ${ props => props.theme.blockPaddingV }rem ${ props => props.theme.blockPaddingH }rem;
position: relative;
margin-left: 0;
`
}
&:hover {
  background: ${ p =>
    lighten ( 0.04, p.primary ? p.theme.primaryColor : p.theme.secondaryColor )
  };
}
&:active {
  background: ${ p => 
    darken ( 0.01, p.primary ? p.theme.primaryColor : p.theme.secondaryColor )
  };
  top: 1px;
}
`

export const Buttons = ( { children }: any ) =>
  <Row>
    <Col xs={true} />
    { children }
  </Row>