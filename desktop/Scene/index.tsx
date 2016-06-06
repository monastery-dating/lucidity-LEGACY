import './style.scss'
import { Component } from '../Component'
import { ContextType } from '../../modules/context.type'
import { editable, openModal, pane } from '../../modules/Factory'
import { Graph } from '../Graph'
import { SceneType } from '../../modules/Scene'

const SceneName = editable ( [ 'scene', 'name' ] )

const SceneOptions = pane ( 'scene' )

export const Scene = Component
( { scene: [ 'scene' ]
    // update ui on scene name edit
  , editing: SceneName.path
    // ensure that we redraw on pane changes
  , pane: SceneOptions.path
    // update graph ui
  , blockId: [ 'block', '_id' ]
  , blockName: [ 'block', 'name' ]
    // update graph on drag op
  , drop: [ '$dragdrop', 'drop' ]
  }
, ( { state, signals }: ContextType ) => {
    const dclass = state.drop && state.drop.ownerType === 'scene'
    const klass = { Scene: true, drop: dclass }

    const scene: SceneType = state.scene
    if ( !scene ) {
      return ''
    }

    const deleteModal = openModal
    ( { message: 'Delete scene ?'
      , type: 'scene'
      , _id: scene._id
      , operation: 'remove'
      , confirm: 'Delete'
      }
    , signals
    )
    return <div class={ klass }>
        <div class='bar'>
          <SceneOptions.toggle class='fa fa-film'/>
          <SceneName class='name'/>
        </div>
        <SceneOptions>
          <div class='button delete'
            on-click={ deleteModal }>
            delete
          </div>
          <div class='button'>duplicate</div>
        </SceneOptions>
      <Graph key='scene.graph'
        selectedBlockId={ state.blockId }
        ownerType={ 'scene' }
        graph={ scene.graph } />
      </div>
  }
)
