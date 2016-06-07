import { BlockHelper, BlockType } from '../../Block'
import { makeId } from '../../Factory'
import { GraphType } from '../../Graph'
import { GraphHelper } from '../../Graph/helper/GraphHelper'
import { SceneType } from '../../Scene'

const rootBlockId = BlockHelper.rootBlockId

export module SceneHelper {

  export const create =
  () : SceneType => {
    const _id = makeId ()
    const graph = GraphHelper.create ()
    return Object.freeze
    ( { _id
      , type: 'scene'
      , name: 'New scene'
      , graph
      , blockId: rootBlockId
      }
    )
  }

  export const select =
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

}

export type SceneHelperType = typeof SceneHelper
