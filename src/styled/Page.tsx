import { JSX } from 'builder'
import { styled, Col, Row } from 'styled'

const ThePage = Col.extend`
background: #fbfbfb;
border: 1px solid #999;
box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
box-sizing: border-box;
color: #333;
margin: 1rem;
min-height: 40vh;
position: relative;
padding: 3rem ${ p => p.theme.pagePadding }px;
width: ${ p => p.theme.pageWidth }px;
`

export const Page = ( { children, className }: any ) =>
  <ThePage data-c='Page' className={ className }>
    { children }
  </ThePage>
