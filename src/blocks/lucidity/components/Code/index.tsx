import { JSX } from 'builder'
import { styled, Col, Row } from 'styled'

import { CodeDisplay } from './CodeDisplay'
export { CodeIcon } from './CodeIcon'

export const ScorePara = styled.div`
margin-top: -1.5rem;
`

export function Code ( { path }: { path: string } ) {
  return (
    <ScorePara>
      <Row style={{ position: 'relative' }}>
        <Col xs={ 1 }>
          { /* <Running path={ path } /> */ }
        </Col>
        <Col xs={ true }>
          { /* <Error path={ path } /> */ }
        </Col>
        <Col>
          { /* <Randomize path={ path } /> */ }
          { /* <Transport path={ path } /> */ }
        </Col>
      </Row>
      <CodeDisplay path={ path } />
    </ScorePara>
  )
}
