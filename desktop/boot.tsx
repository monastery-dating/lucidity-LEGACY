// modules
import { App } from '../modules/App'
import { Block } from '../modules/Block'
import { Data } from '../modules/Data'
import { DragDrop } from '../modules/DragDrop'
import { Factory } from '../modules/Factory'
import { Graph } from '../modules/Graph'
import { Library } from '../modules/Library'
import { Playback } from '../modules/Playback'
import { Project } from '../modules/Project'
import { Scene } from '../modules/Scene'
import { Status } from '../modules/Status'
import { User } from '../modules/User'
import { Sync } from '../modules/Sync'

// import Router from 'cerebral-module-router'
import * as Controller from 'cerebral'
import * as Devtools from 'cerebral-module-devtools'
import * as Http from 'cerebral-module-http'
import * as Model from 'cerebral-model-baobab'

import { Component, render } from './Component' // Component for jsx on this page
import { App as AppView } from './App'
//import { TestView as AppView } from './TestView'

const model = Model ( {} )
const controller = Controller ( model )

controller.addModules
( { app: App ()
  , block: Block ()
  , data: Data ()
  , $dragdrop: DragDrop ()
  , $factory: Factory ()
  , graph: Graph ()
  , devtools: Devtools ()
  , http: Http ()
  , library: Library ()
  , playback: Playback ()
  , project: Project ()
  , scene: Scene ()
  , $status: Status ()
  , user: User ()
  , $sync: Sync ()
  }
)

render
( () => <AppView/>
, document.getElementById ( 'app' )
, controller
)

const warn = console.warn
console.warn = ( msg ) => {
  console.trace ()
  warn.call ( console, msg )
}

controller.getSignals().app.mounted ()
