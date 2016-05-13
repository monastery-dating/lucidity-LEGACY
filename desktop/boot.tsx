// modules
import { App } from '../modules/App'
import { Data } from '../modules/Data'
import { Factory } from '../modules/Factory'
import { Library } from '../modules/Library'
import { Playback } from '../modules/Playback'
import { Project } from '../modules/Project'
import { Scene } from '../modules/Scene'
import { Status } from '../modules/Status'
// import User from '../modules/User'

// import Router from 'cerebral-module-router'
import * as Controller from 'cerebral'
import * as Devtools from 'cerebral-module-devtools'
import * as Http from 'cerebral-module-http'
import * as Model from 'cerebral-model-baobab'

import { Component, render } from './Component' // Component for jsx on this page
import { App as AppView } from './App'

const model = Model ( {} )
const controller = Controller ( model )

controller.addModules
( { app: App ()
  , data: Data ()
  , $factory: Factory ()
  , devtools: Devtools ()
  , http: Http ()
  , library: Library ()
  , playback: Playback ()
  , project: Project ()
  , $status: Status ()
  }
)

render
( () => <AppView/>
, document.getElementById ( 'app' )
, controller
)

controller.getSignals().app.mounted ()
