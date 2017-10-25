import { JSX } from 'builder'
import { styled, Col, Row } from 'styled'
import { Card } from 'styled/Card'

const FullRow = Row.extend`
  flex-grow: 1;
  overflow: auto;
`

export const Background = styled.div`
bottom: 0;
background: #000;
opacity: 0.6;
position: fixed;
left: 0;
right: 0;
top: 0;
z-index: 9;
`

const TopCard = styled.div`
z-index: 99;
`

interface Props {
  children?: React.ReactNode
}

export const Modal = ( { children }: Props ) =>
  <FullRow data-c='Modal' middle='xs' center='xs'>
    <Background />
    <TopCard>
      <Card large>
        { children }
      </Card>
    </TopCard>
  </FullRow>