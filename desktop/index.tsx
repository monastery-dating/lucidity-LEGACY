import App from './App/index'
import Controller from 'cerebral'
import Devtools from 'cerebral-module-devtools'
import Http from 'cerebral-module-http'
import Model from 'cerebral-model-baobab'
// import Library from './modules/Library'
// import Project from './modules/Project'
// import Router from 'cerebral-module-router'
// import Scene from './modules/Scene'
// import User from './modules/User'
// We need Component because of jsx usage
import { Component, render } from 'cerebral-view-snabbdom'

// HACK to support typescript transpiler for tsx files
Component.createElement = Component.DOM

const controller = Controller ( Model ( {} ) )

// Our modules
controller.addModules
( {
  }
)
// Default modules
controller.addModules
( { http: Http ()
  , devtools: Devtools ()
  /*
  , router: Router
    ( { '/': 'example.redirectRoot' // these are signals
      }
    , { onlyHash: true }
    )
    */
  }
)

render
( () => <App/>
, document.getElementById ( 'app' )
, controller
)
