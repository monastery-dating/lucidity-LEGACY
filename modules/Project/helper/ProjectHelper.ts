import { makeId } from '../../Factory'
import { createGraph, GraphType } from '../../Graph'
import { ProjectType } from '../../Project'
import { createScene, selectScene, SceneType } from '../../Scene'
import { CompilerError } from '../../Code'

interface ProjectCreate {
  project: ProjectType
  scene: SceneType
}

export const createProject =
(): Promise<ProjectCreate> => {
  const _id = makeId ()
  let graph: GraphType
  let scene: SceneType
  const p = new Promise<ProjectCreate>
  ( ( resolve, reject ) => {
    Promise.all
    ( [ createGraph ()
        .then ( ( g ) => { graph = g } )
      , createScene ()
        .then ( ( s ) => { scene = s } )
      ]
    )
    .then ( () => {
      const project: ProjectType = Object.freeze
      ( { _id
        , type: 'project'
        , name: 'New project'
        , graph
        , scenes: [ scene._id ]
        }
      )
      resolve ( { scene, project } )
    })
    .catch ( reject )
  })

  return p
}

export const selectProject =
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
      return selectScene ( state, nuser, scene )
    }
  }
  return nuser
}
