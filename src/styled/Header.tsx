import { JSX } from 'builder'
import { styled, Col, Row } from 'styled'

const HeaderContent = styled.div`
padding: ${ props => props.theme.regionPadding };
padding-top: 80px;
flex-grow: 0;
`

export const Header = ( props: any ) =>
  /* We are in 'column' flex direction. 'Col' here are stacked vertically.
   * Not sure why this works because Content breaks if it's a Col...
   */ 
  <Col>
    <Row center='md'>
      <Col xs={12}>
        <HeaderContent>
          { props.children }
        </HeaderContent>
      </Col>
    </Row>
  </Col>