import { Component } from 'cerebral-view-snabbdom'
import ProjectPane from './ProjectPane/index'
import ToolsPane from './ToolsPane/index'
import Workbench from './Workbench/index'

export default Component
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
    </div>
  )
)
