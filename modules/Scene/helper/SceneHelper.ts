import { BlockHelper, BlockType } from '../../Block'
import { makeId } from '../../Factory'
import { GraphHelper, GraphType } from '../../Graph'
import { SceneType } from '../../Scene'

export interface SceneCreateType {
  scene: SceneType
  block: BlockType
}

export module SceneHelper {

  export const create =
  () : SceneCreateType => {
    const _id = makeId ()
    const block = BlockHelper.main ()
    const graph = GraphHelper.create ( block )
    const scene = Object.assign
    ( { _id
      , type: 'scene'
      , name: 'New scene'
      , graph
      }
    )

    return { block, scene }
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

    // do not select block on scene change

    return Object.assign
    ( {}
    , user
    , { sceneId: scene._id
      }
    )
  }

}

export type SceneHelperType = typeof SceneHelper
