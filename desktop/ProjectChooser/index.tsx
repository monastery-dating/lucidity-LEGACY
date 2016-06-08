import './style.scss'
import { Component } from '../Component'
import { ContextType, SignalsType } from '../../modules/context.type'
import { ProjectType } from '../../modules/Project'

interface ProjectsByIdType {
  [ key: string ]: ProjectType
}

interface ShowProjectType {
  projectsById: ProjectsByIdType
  selectedProjectId: string
}

const selectProject =
( signals: SignalsType, _id ) => {
  signals.project.select
  ( { _id } )
}

const sortByName = ( a, b ) => a.name > b.name ? 1 : -1

const showProjects =
( { projectsById, selectedProjectId }: ShowProjectType
, signals: SignalsType
) => {
  const list = []
  for ( const k in ( projectsById || {} ) ) {
    list.push ( projectsById [ k ] )
  }
  list.sort ( sortByName )
  return list.map
  ( ( project ) => (
      <a class={{ li: true
                , sel: project._id === selectedProjectId
                }}
         href= {`/#/project/${project._id}` }>
        <div class='fa fa-film'></div>
        { project.name }
      </a>
    )
  )
}

export const ProjectChooser =
Component
( { projectsById: [ 'data', 'project' ]
  , selectedProjectId: [ '$projectId' ]
  }
, ( { state, signals }: ContextType ) => (
    <div class={{ ProjectChooser: true, Modal: true, active: true }}>
      <div class='wrap'>
        <p class='message'>Select project</p>
        <div class='list'>
          { showProjects ( state, signals ) }
          <div class='li add'
            on-click={ () => signals.project.add ( {} ) }>
            +
          </div>
        </div>
      </div>
    </div>
  )
)
