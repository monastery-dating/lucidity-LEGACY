import { ActionContextType } from '../../context.type'
export const removeAction =
( { state
  , input: { clear }
  , output
  } : ActionContextType
) => {
  // clear modal
  state.set ( [ '$factory', 'modal', 'active' ], false )
  // clear options pane
  state.set ( [ '$factory', 'pane',  'scene'  ], false )

  const doc = state.get ( [ 'scene' ] )
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

  // Select new scene
  docs.push
  ( Object.assign
    ( {}
    , state.get ( [ 'data', 'main', 'scene' ] )
    , { value: scenes [ selidx ] }
    )
  )

  // Remove element
  docs.push
  ( Object.assign ( {}, doc, { _deleted: true } )
  )

  output ( { docs } )
}
