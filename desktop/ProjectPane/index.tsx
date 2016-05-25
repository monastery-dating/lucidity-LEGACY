import './style.scss'
import { Component } from '../Component'
import { ContextType, SignalsType } from '../../modules/context.type'
import { add, pane } from '../../modules/Factory'

const selectScene =
( signals: SignalsType, _id ) => {
  signals.data.selected
  ( { select: { type: 'scene', _id } } )
}

const sortByName = ( a, b ) => a.name > b.name ? 1 : -1

const showScenes =
( { scenes, sceneById, selectedSceneId }
, signals: SignalsType  ) => {
  if ( !scenes || !sceneById ) {
    return ''
  }
  const list = scenes.map ( ( id ) => sceneById [ id ] || {} )
  list.sort ( sortByName )
  return list.map
  ( ( scene ) => (
      <div class={{ li: true
                  , sel: scene._id === selectedSceneId
                  }}
        on-click={ () => selectScene ( signals, scene._id ) }>
        <div class='fa fa-film'></div>
        { scene.name }
      </div>
    )
  )
}


const AddScene = add ( 'scene', [ 'project', 'scenes' ] )

const Pane = pane ( 'project' )

export const ProjectPane = Component
( { scenes: [ 'project', 'scenes' ]
  , sceneById: [ 'data', 'scene' ]
  , selectedSceneId: [ 'scene', '_id' ]
  }
, ( { state, signals }: ContextType ) => (

    <Pane class='ProjectPane'>
      <Pane.toggle class='fbar bar'>
        <div class='fa fa-diamond'></div>
        <div class='name'>Project</div>
        <div class='larrow'></div>
      </Pane.toggle>

      <Pane.toggle class='bar'>
        <div class='spacer'></div>
        <div class='rarrow'></div>
        &nbsp;
      </Pane.toggle>

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
          { showScenes ( state, signals ) }
          <AddScene class='li'>+</AddScene>
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
    </Pane>
  )
)
