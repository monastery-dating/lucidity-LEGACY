import { JSX } from 'builder'
import { Document } from 'blocks/Document/components'
import { Col, Row } from 'styled'
import { Auth } from 'styled/Auth'
import { Layout } from 'styled/Layout'

import './style.scss'

const VERSION = process.env.VERSION as string

const Version = Col.extend`
opacity: 0.3;
`

export function App () {
  return (
    <Layout className='Logo'>
      <Auth>
        <Col>
          <Document />
        </Col>
        <Col>
          Result
        </Col>
      </Auth>
    </Layout>
  )
}
