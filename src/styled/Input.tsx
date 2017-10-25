import { Signal, State } from 'app'
import { JSX, connect } from 'builder'
import { styled, Col, Row } from 'styled'
import { props, state, signal } from 'cerebral/tags'
import { translate, Translate } from 'config/translate'

interface Props {
  changed: typeof Signal.forms.valueChanged
  submitSignal (): void
  translate: Translate
  value: string
}

interface EProps {
  className?: string
  name: string
  placeholder?: boolean
  scope: string
  submit?: string
  type?: string
}

export const BaseInput = connect < Props, EProps > (
  { changed: signal`forms.valueChanged`
  , submitSignal: signal`${ props`submit` }`
  , value: state`${ props`scope` }.${ props`name` }`
  , translate
  }
, function BaseInput
  ( { changed, className, name, placeholder, scope, submit, submitSignal, translate, type, value } ) {
    function onChange ( e: React.FormEvent<HTMLInputElement> ) {
      changed
      ( { value: e.currentTarget.value
        , path: `${ scope }.${ name }`
        }
      )
    }
    
    function onKeyPress ( e: React.KeyboardEvent<HTMLInputElement> ) {
      if ( submit && e.key === 'Enter' ) {
        submitSignal ()
      }
    }

    return <input
      className={ className }
      name={ name }
      onChange={ onChange }
      onKeyPress={ onKeyPress }
      placeholder={ placeholder ? translate ( name, 'Placeholder' ) : '' }
      type={ type }
      value={ value || '' }
      />
  }
)

export const Input = styled(BaseInput)`
background: none;
border: none;
color: ${ props => props.theme.inputColor };
display: flex;
font-family: ${ props => props.theme.fontFamily };
flex-grow: 1;
font-size: 1rem;
line-height: 2rem;
padding: 0.2rem 0.5rem 0 0.5rem;
`
