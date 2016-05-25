export * from './signals/remove.signal'
export * from './helper/SceneHelper'

interface removeInputs {
  clear?: string[]
}

export interface SceneSignalsType {
  // TODO: rename reloaded or attached or ...
  remove ( input: removeInputs )
}

import * as Model from 'cerebral-model-baobab'
import { remove } from './signals/remove.signal'
import { SceneHelper } from './helper/SceneHelper'

const CurrentScene = Model.monkey
( { cursors:
    { sceneById: [ 'data', 'scene' ]
    , id: [ 'data', 'main', 'scene', 'value' ]
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
    ( { remove
      }
    )

    module.addServices
    ( SceneHelper
    )

    return {} // meta information
  }
}
