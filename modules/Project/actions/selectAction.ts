import { ActionContextType } from '../../context.type'
import { ProjectHelper } from '../'

export const selectAction =
( { state
  , input: { doc, _id }
  , output
  } : ActionContextType
) => {
  const user = state.get ( [ 'user' ] ) || {}

  if ( doc ) {
    // Editing project properties
    if ( ! user.projectId || ! doc._rev ) {
      // New project, we select it after creation.
      const docs = [ doc ]
      output
      ( { docs:
          [ doc, ProjectHelper.select ( state, user, doc )
          ]
        }
      )
    }
    else {
      // pass through, nothing to select
    }
  }
  else {
    // simple select
    const project = state.get ( [ 'data', 'project', _id ] )
    const sel = ProjectHelper.select ( state, user, project )
    if ( sel ) {
      output ( { doc: sel } )
    }
  }
}
