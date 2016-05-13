import './style.scss'
import { Component } from 'cerebral-view-snabbdom'
import ProjectPane from './ProjectPane'
import ToolsPane from './ToolsPane'
import Workbench from './Workbench'
import StatusBar from './StatusBar'

export const App =
Component
( {
  }
, ( { state, signals } ) => (
    <div>
      <svg id='scratch' className='svg'>
        <text className='tbox' id='tsizer'></text>
      </svg>
      {/*
        <le-boxdrag></le-boxdrag>
        */}
      <ToolsPane></ToolsPane>
      <Workbench></Workbench>
      <ProjectPane></ProjectPane>
      <StatusBar></StatusBar>
    </div>
  )
)
