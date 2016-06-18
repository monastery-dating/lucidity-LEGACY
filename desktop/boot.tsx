// modules
import { App } from '../modules/App'
import { setKeySignals } from '../modules/App/actions/bindkeys'
import { Block } from '../modules/Block'
import { Code } from '../modules/Code'
import { Data } from '../modules/Data'
import { DragDrop } from '../modules/DragDrop'
import { Factory } from '../modules/Factory'
import { Graph } from '../modules/Graph'
import { Library } from '../modules/Library'
import { Midi } from '../modules/Midi'
import { Playback } from '../modules/Playback'
import { Project } from '../modules/Project'
import { Scene } from '../modules/Scene'
import { Status } from '../modules/Status'
import { User } from '../modules/User'
import { Sync } from '../modules/Sync'

import * as Router from 'cerebral-module-router'
import * as Controller from 'cerebral'
import * as Devtools from 'cerebral-module-devtools'
import * as Http from 'cerebral-module-http'
import * as Model from 'cerebral-model-baobab'

import { Component, render } from './Component' // Component for jsx on this page
import { App as AppView } from './App'
//import { TestView as AppView } from './TestView'

const model = Model ( {} )
const controller = Controller ( model )
const router = Router
( { '/': 'app.homeUrl'
  , '/project': 'app.projectsUrl'
  , '/project/:_id': 'app.projectUrl'
  , '/user': 'app.userUrl'
  //, '/logout': 'app.logoutUrl'
  //, '/login': 'app.loginUrl'
  }
, { onlyHash: true
  , mapper: { query: true }
  }
)

controller.addModules
( { app: App ()
  , block: Block ()
  , code: Code ()
  , data: Data ()
  , $dragdrop: DragDrop ()
  , $factory: Factory ()
  , graph: Graph ()
  , devtools: Devtools ()
  , http: Http ()
  , library: Library ()
  , midi: Midi ()
  , $playback: Playback ()
  , project: Project ()
  , router
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

setKeySignals
( { setMode: controller.getSignals ().$playback.mode
  }
)

controller.getSignals().app.mounted ()
