import './style.scss'
import { Component } from '../Component'
import { ContextType, SignalsType } from '../../modules/context.type'
import { ComponentByIdType } from '../../modules/Graph'

interface ShowProjectType {
  projectsById: ComponentByIdType
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
  const select = ( e, _id ) => {
    e.preventDefault ()
    signals.app.projectUrl ( { _id })
  }
  return list.map
  ( ( project ) => (
      <div class={{ li: true
                , sel: project._id === selectedProjectId
                }}
         on-click={ ( e ) => select ( e, project._id ) }>
        <div class='fa fa-film'></div>
        { project.name }
      </div>
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
