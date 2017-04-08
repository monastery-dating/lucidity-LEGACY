import { ActionContextType } from '../../context.type'
import { loadProject, selectProjectPath } from '../../FileStorage/helper/FileStorageHelper'
import * as check from 'check-types'

export const selectAction =
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

  selectProjectPath ( project )
  .then ( path => {
    // get scenes
    const scenes = []
    project.scenes.map
    ( id => {
        const s = state.get ( [ 'data', 'scene', id ] )
        if ( s ) { scenes.push ( s ) }
      }
    )
    loadProject ( path, project, scenes )
  })

  const sceneId = state.get ( [ '$sceneId' ] )
  if ( project.scenes.indexOf ( sceneId ) >= 0 ) {
    // do not change
  }
  else {
    state.set ( [ '$sceneId' ], project.scenes [ 0 ] )
  }
}

// selectAction [ 'async' ] = true

selectAction [ 'input' ] =
{ _id: check.string
}
