import { ActionContextType } from '../../context.type'
import { SceneHelper } from '../../Scene'

export const addAction =
( { state
  , input: { }
  , output
  } : ActionContextType
) => {

  const { scene, block }= SceneHelper.create ()
  const docs = [ block, scene ]

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

  // we set doc for select operation
  output ( { docs, doc: scene } )
}
