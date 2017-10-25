import { connect, JSX } from 'builder'
import { css, styled, Col, Row } from 'styled'

export { Content } from './Content'
export { Error } from './Error'
export { Footer } from './Footer'
export { Message, Title } from './Title'

interface BtnProps {
  large?: boolean
}

const CardCol = Col.extend`
${ ( p: BtnProps ) => p.large ? css`
min-width: 24rem;
` : css`
min-width: 16rem;
`}
`

interface Props extends BtnProps {
  children: React.ReactNode
}

export const Card = CardCol
