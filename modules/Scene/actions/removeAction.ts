import { ActionContextType } from '../../context.type'
import { ProjectType } from '../../Project'
import { selectScene, SceneType, SceneByIdType } from '../'

export const removeAction =
( { state
  , input: { _id }
  , output
  } : ActionContextType
) => {
  // clear modal
  state.set ( [ '$factory', 'modal', 'active' ], false )
  // clear options pane
  state.set ( [ '$factory', 'pane',  'scene'  ], false )

  if ( !_id ) {
    output.error
    ( { status:
        { type: 'error', message: 'No _id cannot delete scene' }
      }
    )
    return
  }

  const doc = state.get ( [ 'data', 'scene', _id ] )

  if ( !doc ) {
    output.error
    ( { status:
        { type: 'error', message: 'Cannot delete unselected scene.' }
      }
    )
    return
  }

  const sceneById: SceneByIdType = state.get ( [ 'data', 'scene' ] )

  const docs = []

  // Remove ref in parent
  const parent: ProjectType = state.get ( [ 'project' ] )
  // Find current selection in ordered scenes
  const sortedscenes = [...parent.scenes]
  sortedscenes.sort
  ( ( a, b ) => sceneById [ a ].name > sceneById [ b ].name ? 1 : -1 )
  const oldidx = sortedscenes.indexOf ( doc._id )
  const scenes = sortedscenes.filter
  ( ( id ) => id !== doc._id )

  const selidx = oldidx >= scenes.length ?
                 scenes.length - 1 : oldidx
  const sceneId = scenes [ selidx ]
  // Change parent
  docs.push
  ( Object.assign
    ( {}
      , parent
      , { scenes }
    )
  )

  const user = state.get ( [ 'user' ] )
  const newScene = sceneById [ sceneId ]


  // Select new scene
  docs.push
  ( selectScene ( state, user, newScene )
  )

  // Remove element
  docs.push
  ( Object.assign ( {}, doc, { _deleted: true } )
  )

  // Remove graph
  const graph = doc.graph

  if ( graph ) {
    const nodes = graph.nodes
  }

  output.success ( { docs } )
}
