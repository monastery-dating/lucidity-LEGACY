/* global it */
import React from 'react'
import render from '../TestHelper'
import App from './App'

it('renders without crashing', () => {
  render(<App />)
})
