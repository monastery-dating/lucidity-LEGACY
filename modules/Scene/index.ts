import * as Model from 'cerebral-model-baobab'

const CurrentScene = Model.monkey
( { cursors:
    { sceneById: [ 'data', 'scene' ]
    , id: [ 'project', 'selectedSceneId' ]
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

    return {} // meta information
  }
}
