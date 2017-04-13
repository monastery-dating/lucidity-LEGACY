import { DOM, JSX, Container } from './components/Component'
import { Controller } from 'cerebral'
import Devtools from 'cerebral/devtools'
import { editor } from './modules/editor'

import App from './components/App'
import './index.css'

declare var process: any

const controller = Controller
( { state: {}
  , modules:
    { editor
    }
  , devtools: 
    process.env.NODE_ENV === 'production'
    ? undefined
    : Devtools
      ( { remoteDebugger: 'localhost:8585'
        }
      )
  }
)

DOM.render
( <Container controller={ controller }>
    <App />
  </Container>,
  document.getElementById ( 'root' )
)
