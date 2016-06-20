import { ActionContextType } from '../../context.type'
import { createScene } from '../../Scene'

export const addAction =
( { state
  , input: { }
  , output
  } : ActionContextType
) => {

  createScene ()
  .then ( ( scene ) => {
    const docs = [ scene ]


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

  })
  .catch ( ( errors ) => {
    console.log ( errors )
    output.error ( { errors } )
  })
}
