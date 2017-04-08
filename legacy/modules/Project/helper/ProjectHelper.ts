import { makeId } from '../../Factory'
import { ComponentType, createGraph, GraphType } from '../../Graph'
import { createScene, selectScene } from '../../Scene'
import { CompilerError } from '../../Code'

interface ProjectCreate {
  project: ComponentType
  scene: ComponentType
}

export const createProject =
(): Promise<ProjectCreate> => {
  const _id = makeId ()
  let graph: GraphType
  let scene: ComponentType
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
      const project: ComponentType = Object.freeze
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
