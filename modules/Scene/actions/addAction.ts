import { ActionContextType } from '../../context.type'
import { SceneHelper } from '../../Scene'

export const addAction =
( { state
  , input: { }
  , output
  } : ActionContextType
) => {

  const scene = SceneHelper.create ()
  const docs = [ scene ]

  // This is a flag that will set name editing after db object
  // is selected.
  state.set ( [ '$factory', 'editing' ], scene._id )

  // add to project
  const project = state.get ( [ 'project' ] )
  const scenes = project.scenes || []
  const list = [ ...scenes, scene._id ]
  docs.push
  ( Object.assign
    ( {}
    , project
    , { scenes: list }
    )
  )

  // we set _id for select operation
  output ( { docs, _id: scene._id } )
}
