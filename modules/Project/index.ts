import * as Model from 'cerebral-model-baobab'

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

export const Project =
(options = {}) => {
  return (module, controller) => {
    module.addState
    ( CurrentProject
    )

    return {} // meta information
  }
}
