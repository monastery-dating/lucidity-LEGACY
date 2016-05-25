import * as Model from 'cerebral-model-baobab'
import { makeId } from '../../modules/Factory'

const defaultProject =
{ _id: makeId ()
, type: 'project'
, name: 'New project'
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
