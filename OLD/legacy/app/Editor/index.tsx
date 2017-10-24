import './style.scss'
import { Block } from '../Block'
import { Component } from '../Component'
import { Drag } from '../Drag'
import { Library } from '../Library'
import { Modal } from '../../modules/Factory'
import { Playback } from '../Playback'
import { Project } from '../Project'
import { ProjectPane } from '../ProjectPane'
import { Scene } from '../Scene'
// import { ToolsPane } from './ToolsPane'

export const Editor =
Component
( {}
, () => (
    <div class='Editor'>
      <Modal key='Modal'/>
      <div class='Workbench'>
        <Playback key='playback'/>
        <div class='stretch'>
          <Project key='Project'/>
          <Scene key='Scene'/>
          <Block/>
        </div>
      </div>
      <Library key='Library'></Library>
      <ProjectPane key='ProjectPane'></ProjectPane>
      <Drag key='Drag'/>
    </div>
  )
)
