import './style.scss'
import { Component } from 'cerebral-view-snabbdom'
import { Library } from './Library'
import { Login } from './Login'
import { Modal } from '../modules/Factory'
import { ProjectChooser } from './ProjectChooser'
import { ProjectPane } from './ProjectPane'
import { Signup } from './Signup'
import { StatusBar } from './StatusBar'
import { StatusDetail } from './StatusDetail'
// import { ToolsPane } from './ToolsPane'
import { Workbench } from './Workbench'

const appStateChooser = ( state ) => {
  /*
  if ( true ) {
    return <Signup/>
  }
  else
  */
  // FIXME: it's time to use the router !!
  if ( !state.user ) {
    return <Login/>
  }
  else if ( !state.project ) {
    return <ProjectChooser/>
  }
  else {
    return  <div>
        <Modal/>
        <Workbench></Workbench>
        <Library></Library>
        <ProjectPane></ProjectPane>
        <ProjectChooser/>
        <StatusBar></StatusBar>
        <StatusDetail></StatusDetail>
      </div>
  }

}

export const App =
Component
( { project: [ 'project' ]
  , user: [ 'user' ]
  }
, ( { state, signals } ) => (
    <div>{ appStateChooser ( state ) }</div>
  )
)
