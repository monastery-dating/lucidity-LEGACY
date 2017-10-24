import './style.scss'
import { Component } from '../Component'
import { ContextType, SignalsType } from '../../modules/context.type'
import { add, pane } from '../../modules/Factory'

const sortByName = ( a, b ) => a.name > b.name ? 1 : -1

let oldprops
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
        on-click={ () => signals.scene.select ( { _id: scene._id } ) }>
        <div class='fa fa-film'></div>
        { scene.name }
      </div>
    )
  )
}

const Scenes = Component
( {}
, ( { props, signals }: ContextType ) => (
    <div class='scenes'>
      <p>Scenes</p>

      <div>
        { showScenes ( props, signals ) }
        <div class='li add'
          on-click={ () => signals.scene.add ( {} ) }>
          +
        </div>
      </div>
    </div>
  )
)

const Pane = pane ( 'project' )

export const ProjectPane = Component
( { project: [ 'project' ]
  , sceneById: [ 'data', 'scene' ]
  , selectedSceneId: [ '$sceneId' ]
  // project pane toggle
  , pane: Pane.path
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

      <div class='op'
        on-click={ ( e ) => signals.app.projectsUrl () }>
        projects
        <div class='fa fa-hand-o-right'></div>
      </div>

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

      <Scenes
        scenes={ ( state.project || {} ).scenes }
        sceneById={ state.sceneById }
        selectedSceneId={ state.selectedSceneId }
        key='project.scenes'/>

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
