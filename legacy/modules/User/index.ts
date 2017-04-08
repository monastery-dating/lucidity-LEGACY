import * as Model from 'cerebral-model-baobab'
import { githubLibraryGet } from './signals/githubLibraryGet'
import { libraryGithubPath } from './signals/libraryGithubPath'
import { libraryGithubToken } from './signals/libraryGithubToken'
import { makeId } from '../../modules/Factory'
import { name } from './signals/name'

export interface UserSignalsType {
  githubLibraryGet () // try to fetch library from github
  libraryGithubPath ( input: { value: string } )
  libraryGithubToken ( input: { value: string } )
  name ( input: { value: string } )
}

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
    ( { name
      , githubLibraryGet
      , libraryGithubPath
      , libraryGithubToken
      }
    )

    return {} // meta information
  }
}
