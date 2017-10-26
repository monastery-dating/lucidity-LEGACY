import { JSX } from 'builder'
import { Document } from 'blocks/Document/components'
import { styled, Col, Row } from 'styled'
import { Auth } from 'styled/Auth'
import { Layout } from 'styled/Layout'

import './style.scss'

const VERSION = process.env.VERSION as string

const Version = Col.extend`
opacity: 0.3;
`

const MyDocument = styled(Document)`
min-height: 100vh;
width: 50vw;
margin: 0;
padding: 0;
`

const Result = styled.div`
background: black;
min-height: 100vh;
width: 50vw;
`

export function App () {
  return (
    <Layout>
      <Auth direction='row'>
        <MyDocument/>
        <Result/>
      </Auth>
    </Layout>
  )
}
