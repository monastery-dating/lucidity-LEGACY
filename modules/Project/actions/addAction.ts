import { ActionContextType } from '../../context.type'
import { createProject } from '../../Project'

export const addAction =
( { state
  , input: { }
  , output
  } : ActionContextType
) => {
  createProject ()
  .then ( ( { project, scene } ) => {
    const docs = [ scene, project ]

    // add to user's projects
    const user = state.get ( [ 'user' ] )
    const projects = [ project._id, ...( user.projects || []) ]
    docs.push
    ( Object.assign
      ( {}
      , user
      , { projectId: project._id, sceneId: scene._id }
      )
    )

    output.success ( { docs, projectId: project._id } )
  })
  .catch ( ( errors ) => {
    console.log ( errors )
    output.error ( { errors } )
  })
}

addAction [ 'async' ] = true
