import './style.scss'
import { Component } from '../Component'
import { ContextType, SignalsType } from '../../modules/context.type'
import { editable, pane } from '../../modules/Factory'

const ProjectName = editable ( [ 'project', 'name' ] )

const ProjectOptions = pane ( 'project-opts' )

export const Project = Component
( {
  }
, ( { state, signals }: ContextType ) => (
    <div class='Project'>
      <div class='bar'>
        <ProjectOptions.toggle class='fa fa-diamond'/>
        <ProjectName class='name'/>
      </div>
      <ProjectOptions>
        <div class='button delete'>delete</div>
        <div class='button'>duplicate</div>
      </ProjectOptions>
    </div>
  )
)
