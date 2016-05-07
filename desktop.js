import desktop from './desktop/index.tsx'
/*
import Controller from 'cerebral'
import Devtools from 'cerebral-module-devtools'
import Http from 'cerebral-module-http'
import Model from 'cerebral-model-baobab'
import { Component, render } from 'cerebral-view-snabbdom'

// HACK to support typescript transpiler for tsx files
Component.createElement = Component.DOM

const controller = Controller ( Model ( { foo: 'bar' } ) )

// Default modules
controller.addModules
( { http: Http ()
  , devtools: Devtools ()
  }
)

console.log ( 'Starting production.js' )
render
( () => <h1>Hello</h1>
, document.getElementById ( 'app' )
, controller
)
*/

// HMR
// Super basic page reload on changes... Could be better but I
// do not know how...
// check if HMR is enabled
/*
if ( module.hot )
{ // accept update of dependency
  module.hot.accept
  ( './desktop/index.tsx'
  , () => {
      // reload page
      location.reload ()
    }
  )
}
*/
