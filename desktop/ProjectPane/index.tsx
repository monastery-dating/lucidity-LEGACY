import { Component } from '../Component'
import { ProjectSignals } from '../../modules/Project'
import EditableText from '../EditableText'

const sortByTitle = ( a, b ) => a.title > b.title ? 1 : -1

const showScenes =
( { scenes, sceneById, selectedSceneId } ) => {
  if ( !scenes ) {
    return ''
  }
  const list = scenes.map ( ( id ) => sceneById [ id ] )
  list.sort ( sortByTitle )
  return list.map
  ( ( scene ) => (
      <div class={{ li: true
                  , sel: scene._id === selectedSceneId
                  }}>
        scene.title
      </div>
    )
  )
}

export default Component
( { title: [ 'project', 'title' ]
  , stitle: [ '$project', 'title' ]
  , editing: [ '$project', 'editing' ]
  , saving: [ '$project', 'saving' ]
  , scenes: [ 'project', 'scenes' ]
  , sceneById: [ 'data', 'scene' ]
  , selectedSceneId: [ 'project', 'selectedSceneId' ]
  }
, ( { state, signals } ) => (
    <div id='project'>
      <EditableText class='title'
        text={ state.title }
        stext={ state.stitle } // shown while saving
        editing={ state.editing }
        saving={ state.saving }
        on-edit={ signals.project.edit }
        on-change={ ( title ) => signals.project.changed ( { title } ) }
        />

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
          { showScenes ( state )
          }
          <div class='li add'>+</div>
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
