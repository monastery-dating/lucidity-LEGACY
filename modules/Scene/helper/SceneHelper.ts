import { BlockHelper, GraphHelper } from '../../Graph'
import { FactoryCreateHelperType } from '../../Factory'

export module SceneHelper {
  export const create : FactoryCreateHelperType =
  ( { _id, type } ) => {
    const block = BlockHelper.create ( 'main', '' )
    const graph = GraphHelper.create ( block )
    const s = Object.assign
    ( { _id, type }
    , { name: 'New scene'
      , graph
      }
    )

    return [ block, s ]
  }

}

export type SceneHelperType = typeof SceneHelper
