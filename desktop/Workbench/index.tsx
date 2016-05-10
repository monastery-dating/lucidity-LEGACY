import { Component } from '../Component'
import Playback from '../Playback'


export default Component
( { playback: [ 'playback', '$visible' ]
  }
, ( { state, signals } ) => (
    <div id='workbench'>
      { state.playback ? <Playback/> : '' }
      <div id='files'>
        I LOVE my MU
      </div>
    </div>
  )
)
