import { Component } from '../Component'
import { ContextType } from '../../modules/context.type'
import { editable } from '../../modules/Factory'
import { AddNew } from '../AddNew'

const sortByTitle = ( a, b ) => a.title > b.title ? 1 : -1

const showScenes =
( { scenes, sceneById, selectedSceneId } ) => {
  if ( !scenes || !sceneById ) {
    return ''
  }
  const list = scenes.map ( ( id ) => sceneById [ id ] )
  list.sort ( sortByTitle )
  const l = list.map
  ( ( scene ) => (
      <div class={{ li: true
                  , sel: scene._id === selectedSceneId
                  }}>
        scene.title
      </div>
    )
  )
  return l
}

const ProjectTitle = editable ( [ 'project', 'title' ] )

export default Component
( { scenes: [ 'project', 'scenes' ]
  , sceneById: [ 'data', 'scene' ]
  , selectedSceneId: [ 'project', 'selectedSceneId' ]
  }
, ( { state, signals }: ContextType ) => (
    <div id='project'>
      <ProjectTitle/>

      <div class='control'>
        <p>Control</p>

        <div>
          <div class='li'><span>OSC</span></div>
          <div class='li'><span>MIDI</span></div>
          <div class='li'><span>VST Plugin</span></div>
          <div class='li'><span>Keyboard</span></div>
          <div class='li'><span>Mouse</span></div>
        </div>
      </div>

      <div class='scenes'>
        <p>Scenes</p>

        <div>
          { showScenes ( state ) }
          <AddNew class='li'
            type='scene'
            path={ [ 'project', 'scenes' ] }/>
        </div>
      </div>

      <div class='assets'>
        <p>assets</p>

        <div>
          <div class='li'><span>dancing queen.mp4</span></div>
          <div class='li'><span>shiva.jpg</span></div>
          <div class='li'><span>components (lib)</span></div>
          <div class='li'><span>lucy-forge (lib)</span></div>
        </div>
      </div>
    </div>
  )
)
