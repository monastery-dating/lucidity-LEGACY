import './style.scss'
import './Workbench/style.scss'
import { Block } from './Block'
import { Component } from 'cerebral-view-snabbdom'
import { Drag } from './Drag'
import { Library } from './Library'
import { Login } from './Login'
import { Modal } from '../modules/Factory'
import { Playback } from './Playback'
import { Project } from './Project'
import { ProjectChooser } from './ProjectChooser'
import { ProjectPane } from './ProjectPane'
import { Scene } from './Scene'
import { Signup } from './Signup'
import { StatusBar } from './StatusBar'
import { StatusDetail } from './StatusDetail'
// import { ToolsPane } from './ToolsPane'

const appStateChooser = ( state ) => {
  /*
  if ( true ) {
    return <Signup/>
  }
  else
  */
  // FIXME: it's time to use the router !!
  if ( !state.user ) {
    return <Login key='Login'/>
  }
  else if ( !state.project ) {
    return <ProjectChooser key='ProjectChooser'/>
  }
  else {
    return  <div class='wrap'>
        <Modal key='Modal'/>
        <div class='Workbench'>
          <Playback key='playback'/>
          <div class='stretch'>
            <Project key='Project'/>
            <Scene key='Scene'/>
            <Block key='Block'/>
          </div>
        </div>
        <Library key='Library'></Library>
        <ProjectPane key='ProjectPane'></ProjectPane>
        <ProjectChooser key='ProjectChooser'/>
        <StatusBar key='StatusBar'></StatusBar>
        <StatusDetail key='StatusDetail'></StatusDetail>
        <Drag key='Drag'/>
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
