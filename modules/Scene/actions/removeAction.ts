import { ActionContextType } from '../../context.type'
import { SceneHelper } from '../'

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
    return
  }

  const doc = state.get ( [ 'data', 'scene', _id ] )

  if ( !doc ) {
    return
  }

  const sceneById = state.get ( [ 'data', 'scene' ] )

  const docs = []

  // Remove ref in parent
  const parent = state.get ( [ 'project' ] )
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
      , { scenes, sceneId }
    )
  )

  // FIXME use user for scene selection.
  const user = state.get ( [ 'user' ] )
  const newScene = scenes [ selidx ]


  // Select new scene
  docs.push
  ( SceneHelper.select ( state, user, newScene )
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

  output ( { docs } )
}
