import changed from './signals/changed'
import edit from './signals/edit'
import * as Model from 'cerebral-model-baobab'

const sortByTitle = ( a, b ) => a.title > b.title ? 1 : -1


const CurrentProject = Model.monkey
( { cursors:
    { projectById: [ 'data', 'project' ]
    , saving: [ 'project', '$saving' ]
    , stitle: [ 'project', '$title' ]
    , id: [ 'data', 'main', 'projectId', 'value' ]
    }
  , get ( data ) {
      if ( data.saving ) {
        // prevent UI confusion by displaying old title until save syncs
        return data.stitle
      }
      const projectById = data.projectById || {}
      const project = projectById [ data.id ]
      return project ? project.title : 'New project'
    }
  }
)

const selectedSceneId = Model.monkey
( { cursors:
    { projectById: [ 'data', 'project' ]
    , saving: [ 'project', '$saving' ]
    , stitle: [ 'project', '$title' ]
    , id: [ 'data', 'main', 'projectId', 'value' ]
    }
  , get ( data ) {
      if ( data.saving ) {
        // prevent UI confusion by displaying old title until save syncs
        return data.stitle
      }
      const projectById = data.projectById || {}
      const project = projectById [ data.id ]
      return project ? project.title : 'New project'
    }
  }
)

const ProjectScenes = Model.monkey
( { cursors:
  // can we use another monkey here ? [ 'project' ] ?
    { sceneById: [ 'data', 'scene' ]
    , projectById: [ 'data', 'project' ]
    , projectId: [ 'data', 'main', 'projectId', 'value' ]
    }
  , get ( data ) {
      if ( data.projectId ) {
        const projectById = data.projectById || {}
        const project = projectById [ projectById ] || {}
        const sdata = data.sceneById || {}
        const scenes = project.scenes || []
        return scenes.map
        ( ( id ) => sdata [ id ] )
        .sort ( sortByTitle )
      }
      else {
        return []
      }
    }
  }
)

export default (options = {}) => {
  return (module, controller) => {
    module.addState
    ( { title: CurrentProject
      , scenes: ProjectScenes
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
