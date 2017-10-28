import { JSX } from 'builder'
import { Document } from 'blocks/Document/components'
import { Playback } from 'playback'
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
margin: 0;
padding: 0;
`

export function App () {
  return (
    <Layout>
      <Auth direction='row'>
        <MyDocument />
        <Playback />
      </Auth>
    </Layout>
  )
}
