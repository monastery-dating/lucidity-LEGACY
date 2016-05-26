import { BlockHelper } from '../../Block'
import { GraphHelper } from '../../Graph'
import { GraphType } from '../../Graph'
import { makeId } from '../../Factory'

export module SceneHelper {
  export const create =
  () => {
    const _id = makeId ()
    const block = BlockHelper.create ( 'main', '' )
    const graph = GraphHelper.create ( block )
    const s = Object.assign
    ( { _id
      , type: 'scene'
      , name: 'New scene'
      , graph
      }
    )

    return { block, scene: s }
  }

  export const select =
  ( state, user, scene ) => {

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
