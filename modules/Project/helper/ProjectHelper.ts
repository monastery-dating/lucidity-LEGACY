import { makeId } from '../../Factory'
import { GraphHelper } from '../../Graph/helper/GraphHelper'
import { ProjectType } from '../../Project'
import { SceneType } from '../../Scene'
import { SceneHelper } from '../../Scene/helper/SceneHelper'

export module ProjectHelper {

  interface ProjectCreate {
    project: ProjectType
    scene: SceneType
  }

  export const create =
  () : ProjectCreate => {
    const _id = makeId ()
    const graph = GraphHelper.create ()
    const scene = SceneHelper.create ()
    const project: ProjectType = Object.freeze
    ( { _id
      , type: 'project'
      , name: 'New project'
      , graph
      , scenes: [ scene._id ]
      }
    )

    return { scene, project }
  }


  export const select =
  ( state, user, project ) => {
    const nuser = Object.assign
    ( {}
    , user
    , { projectId: project._id
      , sceneId: null
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
