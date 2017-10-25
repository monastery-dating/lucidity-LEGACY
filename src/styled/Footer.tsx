import { JSX } from 'builder'
import { styled, Col, Row } from 'styled'

const FooterContent = Row.extend`
padding: ${ props => props.theme.regionPadding };
color: #777;
flex-grow: 0;
`

export const Footer = ( props: any ) =>
  <Row bottom='xs'>
    <Col xs={12}>
      <FooterContent>
        { props.children }
      </FooterContent>
    </Col>
  </Row>
