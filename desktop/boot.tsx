import App from './App'
import AppModule from '../modules/App'
import * as Controller from 'cerebral'
import * as Devtools from 'cerebral-module-devtools'
import * as Http from 'cerebral-module-http'
import * as Model from 'cerebral-model-baobab'
// import Data from '../modules/Data'
import Library from '../modules/Library'
import Playback from '../modules/Playback'
import Project from '../modules/Project'
// import Router from 'cerebral-module-router'
// import Scene from '../modules/Scene'
// import User from '../modules/User'
// We need Component because of jsx usage
import Status from '../modules/Status'
import { Component, render } from 'cerebral-view-snabbdom'

const controller = Controller ( Model ( {} ) )

controller.addModules
( { app: AppModule ()
  , devtools: Devtools ()
  , http: Http ()
  , library: Library ()
  , playback: Playback ()
  , project: Project ()
  , status: Status ()
  }
)

render
( () => <App/>
, document.getElementById ( 'app' )
, controller
)

controller.getSignals().app.mounted ()
