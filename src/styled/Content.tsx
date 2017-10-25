import { JSX } from 'builder'
import { styled, Col, Row } from 'styled'

const TheContent = styled.div`
padding: ${ props => props.theme.regionPadding };
background: ${ p => p.theme.background };
min-height: 100%;
`

export const Content = ( props: any ) =>
  <Col xs={true}>
    <TheContent>
      { props.children }
    </TheContent>
  </Col>
