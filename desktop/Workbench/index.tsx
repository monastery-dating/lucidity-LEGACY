import { Component } from '../Component'
import { Playback } from '../Playback'
import { Scene } from '../Scene'
import { Project } from '../Project'

import { editable, pane } from '../../modules/Factory'

export default Component
( { playback: [ 'playback', '$visible' ]
  }
, ( { state, signals } ) => (
    <div id='workbench'>
      { state.playback ? <Playback/> : '' }
      <Project/>
      <Scene/>
    </div>
  )
)
        // <ProjectTitle/> /
