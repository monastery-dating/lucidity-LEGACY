import { ActionContextType } from '../../context.type'
import { ProjectHelper } from '../../Project'

export const addAction =
( { state
  , input: { }
  , output
  } : ActionContextType
) => {

  const { project, scene }= ProjectHelper.create ()
  const docs = [ scene, project ]

  // This is a flag that will set name editing after db object
  // is selected.
  state.set ( [ '$factory', 'editing' ], project._id )

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

  output ( { docs } )
}
