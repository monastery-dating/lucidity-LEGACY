import { html } from 'snabbdom-jsx'
import snabbdom from 'snabbdom'
import sclass from 'snabbdom/modules/class'
import sprops from 'snabbdom/modules/props'
import sstyle from 'snabbdom/modules/style'
import sevent from 'snabbdom/modules/eventlisteners'

const patch = snabbdom.init
( [ sclass, sprops, sstyle, sevent ] )

//HelloMessage : (attrs, body) -> vnode
const HelloMessage = ({name}) =>
  <div on-click={ _ => alert('Hi ' + name) }>
    {name}
  </div>;


var vnode = <HelloMessage name="Yassine" />

patch(document.getElementById('app'), vnode);
/*
import App from './desktop/App/index'
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
  */
  /*
  , router: Router
    ( { '/': 'example.redirectRoot' // these are signals
      }
    , { onlyHash: true }
    )
    */
    /*
  }
)

render
( () => <App/>
, document.querySelector ( '#root' )
, controller
)
*/
