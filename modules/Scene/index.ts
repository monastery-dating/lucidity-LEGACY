export * from './helper/SceneHelper'
export * from './SceneType'

export interface SceneSignalsType {
  add ( input: {} )
  name ( input: { value: string } )
  remove ( input: { _id: string } )
  select ( input: { _id: string } )
}

import * as Model from 'cerebral-model-baobab'
import { add } from './signals/add'
import { name } from './signals/name'
import { remove } from './signals/remove'
import { select } from './signals/select'

const CurrentScene = Model.monkey
( { cursors:
    { sceneById: [ 'data', 'scene' ]
    , id: [ '$sceneId' ]
    }
  , get ( data ) {
      const sceneById = data.sceneById || {}
      return sceneById [ data.id ]
    }
  }
)

export const Scene =
( options = {}) => {
  return (module, controller) => {
    module.addState
    ( CurrentScene
    )

    module.addSignals
    ( { add
      , name
      , remove
      , select
      }
    )

    return {} // meta information
  }
}
