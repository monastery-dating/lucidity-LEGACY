import * as Model from 'cerebral-model-baobab'
import { makeId } from '../../modules/Factory'

const defaultUser =
{ _id: 'gaspard' //makeId ()
, type: 'user'
, name: 'New user'
  // selected elements
, projectId: null
, blockId: null
, sceneId: null
}

const CurrentUser = Model.monkey
( { cursors:
    { userById: [ 'data', 'user' ]
    , id: [ '$auth', 'userId' ]
    }
  , get ( data ) {
      const userById = data.userById || {}
      return userById [ data.id || 'gaspard' ]
          || defaultUser
    }
  }
)

export const User =
( options = {}) => {
  return (module, controller) => {
    module.addState
    ( CurrentUser
    )

    module.addSignals
    ( {
      }
    )

    return {} // meta information
  }
}
