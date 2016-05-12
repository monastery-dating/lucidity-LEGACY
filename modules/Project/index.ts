import changed from './signals/changed'
import edit from './signals/edit'
import * as Model from 'cerebral-model-baobab'

const sortByTitle = ( a, b ) => a.title > b.title ? 1 : -1

const CurrentProject = Model.monkey
( { cursors:
    { projectById: [ 'data', 'project' ]
    , id: [ 'data', 'main', 'projectId', 'value' ]
    }
  , get ( data ) {
      const projectById = data.projectById || {}
      return projectById [ data.id ]
    }
  }
)

export default (options = {}) => {
  return (module, controller) => {
    module.addState
    ( CurrentProject
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
