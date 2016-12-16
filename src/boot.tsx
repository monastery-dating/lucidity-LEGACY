import { DOM, JSX, Container } from './components/Component'
import { Controller } from 'cerebral'
import Devtools from 'cerebral/devtools'
import editor from './modules/editor'

import App from './components/App'
import './index.css'

const controller = Controller
( { options: { strictRender: true }
  , state: {}
  , modules:
    { editor
    }
  , devtools: Devtools ()
  }
)

DOM.render
( <Container controller={ controller }>
    <App />
  </Container>,
  document.getElementById ( 'root' )
)
