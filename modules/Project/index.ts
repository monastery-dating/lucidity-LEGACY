import * as Model from 'cerebral-model-baobab'

const defaultProject =
{ _id: new Date ().toISOString ()
, type: 'project'
, title: 'New project'
, scenes: []
}

const CurrentProject = Model.monkey
( { cursors:
    { projectById: [ 'data', 'project' ]
    , id: [ 'data', 'main', 'project', 'value' ]
    }
  , get ( data ) {
      const projectById = data.projectById || {}
      return projectById [ data.id ]
          || defaultProject
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
