import './style.scss'
import { Component } from '../Component'
import { ContextType, SignalsType } from '../../modules/context.type'
import { editable, pane } from '../../modules/Factory'

const ProjectTitle = editable ( [ 'project', 'title' ] )

const ProjectOptions = pane ( 'project' )

export const Project = Component
( { active: ProjectOptions.path
  }
, ( { state, signals }: ContextType ) => (
    <div class='Project'>
      <div class='bar'>
        <div
          class={{fa: true
                 , ['fa-cube']:true
                 , active: state.active
                 }}
          on-click={ () => ProjectOptions.toggle ( signals ) }></div>
        <ProjectTitle class='title'/>
      </div>
      <ProjectOptions>
        <div class='button delete'>delete</div>
        <div class='button'>duplicate</div>
      </ProjectOptions>
    </div>
  )
)
