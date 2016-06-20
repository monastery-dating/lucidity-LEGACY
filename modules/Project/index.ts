export * from './helper/ProjectHelper'
export * from './ProjectType'
export * from './actions/selectAction'

export interface ProjectSignalsType {
  add ( input: {} )
  select ( input: { _id: string } )
  name ( input: { value: string } )
}

import * as Model from 'cerebral-model-baobab'
import { makeId } from '../../modules/Factory'
import { add } from './signals/add'
import { name } from './signals/name'
import { select } from './signals/select'

const CurrentProject = Model.monkey
( { cursors:
    { projectById: [ 'data', 'project' ]
    , id: [ '$projectId' ]
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

    module.addSignals
    ( { add
      , name
      , select
      }
    )

    return {} // meta information
  }
}
