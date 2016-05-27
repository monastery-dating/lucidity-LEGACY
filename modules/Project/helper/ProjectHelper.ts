import { BlockHelper, BlockType } from '../../Block'
import { makeId } from '../../Factory'
import { GraphHelper } from '../../Graph'
import { ProjectType } from '../../Project'
import { SceneHelper, SceneCreateType } from '../../Scene'

export module ProjectHelper {

  interface ProjectCreate {
    project: ProjectType
    block: BlockType
    scene: SceneCreateType
  }

  export const create =
  () : ProjectCreate => {
    const _id = makeId ()
    const block = BlockHelper.main ()
    const graph = GraphHelper.create ( block )
    const scene = SceneHelper.create ()
    const project = Object.assign
    ( { _id
      , type: 'project'
      , name: 'New project'
      , graph
      }
    )

    return { scene, block, project }
  }


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
