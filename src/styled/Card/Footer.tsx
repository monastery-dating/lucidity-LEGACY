import { Row } from 'styled'

export const Footer = Row.extend`
background: ${ p => p.theme.background };
border: ${ p => p.theme.border };
border-top-width: 0;
border-bottom-left-radius: ${ p => p.theme.borderRadius }px;
border-bottom-right-radius: ${ p => p.theme.borderRadius }px;
box-shadow: ${ p => p.theme.boxShadow };
`