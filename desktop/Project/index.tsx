import './style.scss'
import { Component } from '../Component'
import { editable, pane } from '../../modules/Factory'
import { Graph } from '../Graph'

const ProjectName = editable ( [ 'project', 'name' ] )

const ProjectOptions = pane ( 'project-opts' )

export const Project = Component
( { graph: [ 'project', 'graph' ]
  , project: [ 'project' ]
    // update ui on project name edit
  , editing: ProjectName.path
    // ensure that we redraw on pane changes
  , pane: ProjectOptions.path
    // update graph ui
  , blockId: [ 'block', '_id' ]
  , blockName: [ 'block', 'name' ]
    // update graph on drag op
  , drop: [ '$dragdrop', 'drop' ]
  }
, ( { state, signals } ) => {
    const dclass = state.drop && state.drop.ownerType === 'project'
    const klass = { Project: true, drop: dclass }

    return <div class={ klass }>
        <div class='bar'>
          <ProjectOptions.toggle class='fa fa-diamond'/>
          <ProjectName class='name'/>
        </div>
        <ProjectOptions>
          <div class='button delete'>delete</div>
          <div class='button'>duplicate</div>
        </ProjectOptions>
        <Graph key='project.graph'
          ownerType={ 'project' }
          graph={ state.graph } />
      </div>
  }
)
