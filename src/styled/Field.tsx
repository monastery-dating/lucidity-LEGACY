import { JSX } from 'builder'
import { styled, Col, Row } from 'styled'
import { Input } from 'styled/Input'
import { Icon } from 'styled/Icon'

const Label = styled.label`
display: block;
margin: 0;
text-align: left;
`

const Wrap = Row.extend`
background: #fff;
border: 1px solid #ccc;
border-radius: ${ props => props.theme.borderRadius }px;
box-sizing: border-box;
line-height: 1.5rem;
margin: ${ props => props.theme.blockMargin };
`

const FieldIcon = Col.extend`
align-items: center;
background: #ccc;
justify-content: center;
border-right: 1px solid #ccc;
line-height: 2rem;
padding: 0.1rem;
`

interface Props {
  icon?: boolean
  name: string
  submit?: string
  placeholder?: boolean
  scope: string
  type?: string
}

const TheIcon = styled(Icon)`
color: ${ props => props.theme.inputColor };
font-size: 1rem;
line-height: 2rem;
padding: 0 0.5rem;
`
// <Label>{ name }</Label>

const TheInput = styled(Input)`
flex: 1;
`

export const Field = ( { icon, name, submit, placeholder, scope, type }: Props ) =>
  <Wrap>
    { icon ? <FieldIcon><TheIcon icon={ name } /></FieldIcon> : '' }
    <TheInput
      name={ name }
      submit={ submit }
      placeholder={ placeholder }
      scope={ scope }
      type={ type }
      />
  </Wrap>
