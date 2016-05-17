import './style.scss'
import { Component } from '../Component'
import { ContextType, SignalsType } from '../../modules/context.type'
import { editable, openModal, pane } from '../../modules/Factory'

const SceneTitle = editable ( [ 'scene', 'title' ] )

const SceneOptions = pane ( 'scene' )

export const Scene = Component
( { active: SceneOptions.path
  }
, ( { state, signals }: ContextType ) => {
    const deleteModal = openModal
    ( { message: 'Delete scene ?'
      , type: 'scene'
      , operation: 'remove'
      }
    , signals
    )

    return <div class='Scene'>
        <div class='bar'>
          <div
            class={{fa: true
                   , ['fa-film']:true
                   , active: state.active
                   }}
            on-click={ SceneOptions.toggle }></div>
          <SceneTitle class='title'/>
        </div>
        <SceneOptions>
          <div class='button delete'
            on-click={ deleteModal }>
            delete
          </div>
          <div class='button'>duplicate</div>
        </SceneOptions>
      </div>
  }
)
