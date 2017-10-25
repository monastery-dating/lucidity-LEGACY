import { JSX } from 'builder'
import { styled, Col, Row } from 'styled'

const TheSidebar = styled.div`
padding: ${ props => props.theme.regionPadding };
background: #ccc;
color: #444;
min-height: 100%;
`

export const Sidebar = ( props: any ) =>
  <Col xs={3}>
    <TheSidebar>
      { props.children }
    </TheSidebar>
  </Col>
