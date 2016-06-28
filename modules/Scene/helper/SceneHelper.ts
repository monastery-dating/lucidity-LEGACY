import { BlockType, rootBlockId } from '../../Block'
import { makeId } from '../../Factory'
import { GraphType } from '../../Graph'
import { createGraph } from '../../Graph/helper/GraphHelper'
import { SceneType } from '../../Scene'

export const createScene =
() : Promise<SceneType> => {
  const _id = makeId ()
  const p = new Promise<SceneType>
  ( ( resolve, reject ) => {
    createGraph ()
    .then ( ( graph ) => {
      resolve
      ( Object.freeze
        ( { _id
          , type: 'scene'
          , name: 'New scene'
          , graph
          , blockId: rootBlockId
          }
        )
      )
    })
    .catch ( reject )
  })

  return p
}

export const selectScene =
( state
, user
, scene : SceneType
) => {

  if ( !scene ) {
    return Object.assign
    ( {}
    , user
    , { sceneId: null
      }
    )
  }

  return Object.assign
  ( {}
  , user
  , { sceneId: scene._id
    }
  )
}
