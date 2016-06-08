import { ActionContextType } from '../../context.type'

export const selectProject =
( { state
  , input: { _id }
  , output
  , services
  } : ActionContextType
) => {
  const project = state.get ( [ 'data', 'project', _id ] )
  state.set ( [ '$projectId' ], _id )

  if ( !project ) {
    // FIXME: redirect is bad. We should find another way of showing
    // that the project is not available.
    return
  }

  const sceneId = state.get ( [ '$sceneId' ] )
  if ( project.scenes.indexOf ( sceneId ) >= 0 ) {
    // do not change
  }
  else {
    state.set ( [ '$sceneId' ], project.scenes [ 0 ] )
  }
}
