import { GraphType } from '../../Graph'
import { SceneHelper } from '../../Scene'

export module ProjectHelper {

  export const select =
  ( state, user, project ) => {
    const nuser = Object.assign
    ( {}
    , user
    , { projectId: project._id
      , sceneId: null
      , blockId: null
      }
    )

    const scenes = project.scenes || []
    const sceneId = scenes [ 0 ] // can be null

    if ( sceneId ) {
      const scene = state.get [ 'data', 'scene', sceneId ]
      if ( scene ) {
        return SceneHelper.select ( state, nuser, scene )
      }
    }
    return nuser
  }

}

export type ProjectHelperType = typeof ProjectHelper
