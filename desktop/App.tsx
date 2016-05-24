import './style.scss'
import { Component } from 'cerebral-view-snabbdom'
import { Library } from './Library'
import { Modal } from '../modules/Factory'
import { ProjectPane } from './ProjectPane'
import { StatusDetail } from './StatusDetail'
// import { ToolsPane } from './ToolsPane'
import { Workbench } from './Workbench'

export const App =
Component
( {
  }
, ( { state, signals } ) => (
    <div>
      <Modal/>
      {/*
        <le-boxdrag></le-boxdrag>
      <ToolsPane></ToolsPane>
        */}
      <Workbench></Workbench>
      <Library></Library>
      <ProjectPane></ProjectPane>
      <StatusDetail></StatusDetail>
    </div>
  )
)
