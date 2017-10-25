import { connect, JSX } from 'builder'
import { signal, state } from 'cerebral/tags'
import { translate, Translate } from 'config/translate'
import { darken, lighten } from 'polished'
import { css, styled } from 'styled'

interface Props {
  translate: Translate
}

interface BtnProps {
  large?: boolean
  medium?: boolean
}

interface EProps extends BtnProps {
  className?: string
  icon: string
  onClick?: () => void
  selected?: boolean
}

const BaseIcon = connect < Props, EProps > (
  { translate
  }
, function Icon ( { icon, className, onClick, translate } ) {
    const click = onClick ? ( e: React.MouseEvent<HTMLSpanElement> ) => { e.stopPropagation (); onClick () } : undefined
    return <span
      className={ translate ( icon, 'Icon' ) + ' ' + className }
      onClick={ click } 
      />
  }
)

export const Icon = styled(BaseIcon)`
/* fa */
display: inline-block;
font: normal normal normal 14px/1 FontAwesome;
text-rendering: auto;
-webkit-font-smoothing: antialiased;
/* our-stuff */
${ ( p: BtnProps ) => p.large ? css`
font-size: 1.6rem;
margin: 0;
width: 1.6rem;
height: 1.6rem;
` : p.medium ? css`
font-size: 1.2rem;
margin: 0 0.5rem;
width: 1.2rem;
` : css`
margin: 0 0.3rem;
width: 1rem;
`
}
${ p => p.selected ? css`
color: ${ p => p.theme.primaryColor };
` : ''
}
${ p => p.onClick ? css`
cursor: pointer;
&:hover {
  color: ${ p =>
    p.selected
      ? p.theme.primaryColor
      : lighten ( 0.2, p.theme.color )
  };
}
&:active {
  color: ${ p => 
    p.selected
      ? p.theme.primaryColor
      : darken ( 0.1, p.theme.color )
  };
  transform: perspective(1px) translateZ(0);
  transition-duration: 0.1s;
}
` : ``
}
`