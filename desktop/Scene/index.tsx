import './style.scss'
import { Block } from '../Block'
import { Component } from '../Component'
import { ContextType } from '../../modules/context.type'
import { editable, openModal, pane } from '../../modules/Factory'
import { Graph } from '../Graph'

const SceneName = editable ( [ 'scene', 'name' ] )

const SceneOptions = pane ( 'scene' )

export const Scene = Component
( {
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
        <Graph/>
        <Block/>
      </div>
  }
)
