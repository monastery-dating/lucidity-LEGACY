import React from 'react'
import ReactDOM from 'react-dom'
import {Container} from 'cerebral/react'
import App from './components/App'
import controller from './controller'
import './index.css'

ReactDOM.render(
  <Container controller={controller}>
    <App />
  </Container>,
  document.getElementById('root')
)
