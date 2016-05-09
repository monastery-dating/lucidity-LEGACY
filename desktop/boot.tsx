import App from './App'
import AppModule from '../modules/App'
import * as Controller from 'cerebral'
import * as Devtools from 'cerebral-module-devtools'
import * as Http from 'cerebral-module-http'
import * as Model from 'cerebral-model-baobab'
import Library from '../modules/Library'
// import Project from './modules/Project'
// import Router from 'cerebral-module-router'
// import Scene from './modules/Scene'
// import User from './modules/User'
// We need Component because of jsx usage
import Status from '../modules/Status'
import { Component, render } from 'cerebral-view-snabbdom'

const controller = Controller ( Model ( {} ) )

controller.addModules
( { http: Http ()
  , devtools: Devtools ()
  , app: AppModule ()
  , library: Library ()
  , status: Status ()
  }
)

render
( () => <App/>
, document.getElementById ( 'app' )
, controller
)

controller.getSignals().app.mounted ()
