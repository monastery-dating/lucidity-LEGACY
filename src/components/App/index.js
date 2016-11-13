import React from 'react'
import {connect} from 'cerebral/react'

import Editor from '../Editor'
import './style.css'
import logo from './logo.svg'

export default connect(
  null,
  function App () {
    return (
      <div className='App'>
        <div className='App-header'>
          <img src={logo} className='App-logo' alt='logo' />
          <h2>Welcome to React</h2>
        </div>
        <p className='App-intro'>
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <Editor />
      </div>
    )
  }
)
