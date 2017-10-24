import { BlockType, rootBlockId } from '../../Block'
import { makeId } from '../../Factory'
import { ComponentType, GraphType } from '../../Graph'
import { createGraph } from '../../Graph/helper/GraphHelper'

export const createScene =
() : Promise<ComponentType> => {
  const _id = makeId ()
  const p = new Promise<ComponentType>
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
, scene : ComponentType
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
