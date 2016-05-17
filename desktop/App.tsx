import './style.scss'
import { Component } from 'cerebral-view-snabbdom'
import { Modal } from '../modules/Factory'
import { ProjectPane } from './ProjectPane'
import StatusBar from './StatusBar'
import ToolsPane from './ToolsPane'
import Workbench from './Workbench'

export const App =
Component
( {
  }
, ( { state, signals } ) => (
    <div>
      <svg id='scratch' className='svg'>
        <text className='tbox' id='tsizer'></text>
      </svg>
      <Modal/>
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
