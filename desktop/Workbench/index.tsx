import './style.scss'
import { Block } from '../Block'
import { Component } from '../Component'
import { Playback } from '../Playback'
import { Scene } from '../Scene'
import { Project } from '../Project'

import { editable, pane } from '../../modules/Factory'

export const Workbench = Component
( { playback: [ 'playback', '$visible' ]
  }
, ( { state, signals } ) => (
    <div class='Workbench'>
      { state.playback ? <Playback/> : '' }
      <div class='stretch'>
        <Project/>
        <Scene/>
        <Block/>
      </div>
    </div>
  )
)
        // <ProjectName/> /
