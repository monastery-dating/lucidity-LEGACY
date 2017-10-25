import { styled, Row } from 'styled'

export const Content = styled.div`
background: ${ p => p.theme.background };
border: ${ p => p.theme.border };
border-top: none;
border-bottom: none;
box-shadow: ${ p => p.theme.boxShadow };
display: flex;
flex-direction: column;
position: relative;
`
