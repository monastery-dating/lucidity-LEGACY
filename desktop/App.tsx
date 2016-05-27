import './style.scss'
import { Component } from 'cerebral-view-snabbdom'
import { Library } from './Library'
import { Login } from './Login'
import { Modal } from '../modules/Factory'
import { ProjectChooser } from './ProjectChooser'
import { ProjectPane } from './ProjectPane'
import { StatusDetail } from './StatusDetail'
// import { ToolsPane } from './ToolsPane'
import { Workbench } from './Workbench'

export const App =
Component
( { project: [ 'project' ]
  , user: [ 'user' ]
  }
, ( { state, signals } ) => {
    if ( !state.user ) {
      return <Login/>
    }
    else if ( !state.project ) {
      return <ProjectChooser/>
    }
    else {
      return  <div>
      <Modal/>
      {/*
        <le-boxdrag></le-boxdrag>
      <ToolsPane></ToolsPane>
        */}
        <Workbench></Workbench>
        <Library></Library>
        <ProjectPane></ProjectPane>
        <ProjectChooser/>
      <StatusDetail></StatusDetail>
    </div>
    }
  }
)
