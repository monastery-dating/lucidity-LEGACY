import changed from './signals/changed'
import edit from './signals/edit'
import * as Model from 'cerebral-model-baobab'

const CurrentProject = Model.monkey
( { cursors:
    { projects: [ 'data', 'project' ]
    , saving: [ 'project', '$saving' ]
    , stitle: [ 'project', '$title' ]
    , id: [ 'data', 'main', 'projectId', 'value' ]
    }
  , get ( data ) {
      if ( data.saving ) {
        // prevent UI confusion by displaying old title until save syncs
        return data.stitle
      }
      const projects = data.projects || {}
      const project = projects [ data.id ]
      return project ? project.title : 'New project'
    }
  }
)

export default (options = {}) => {
  return (module, controller) => {
    module.addState
    ( { title: CurrentProject
      , $editing: false
      , $saving: false
      }
    )

    module.addSignals
    ( { changed
      , edit
      }
    )

    return {} // meta information
  }
}

interface AllSignals {
  changed ( { title: string } )
  edit ( {} )
}

export interface ProjectSignals {
  project: AllSignals
}
