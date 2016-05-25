import { ActionContextType } from '../../context.type'
import { SceneHelper } from '../'

export const selectAction =
( { state
  , input: { docs, doc, _id }
  , output
  } : ActionContextType
) => {
  const user = state.get ( [ 'user' ] )

  if ( doc ) {
    // Editing project properties
    if ( ! doc._rev ) {
      // New scene, we select it after creation.
      const alldocs = docs ? [ ...docs, doc ] : [ doc ]
      alldocs.push ( SceneHelper.select ( state, user, doc ) )
      output ( { docs: alldocs } )
    }
    else {
      // pass through, nothing to select
    }
  }
  else {
    // simple select
    const scene = state.get ( [ 'data', 'scene', _id ] )
    const sel = SceneHelper.select ( state, user, scene )
    if ( sel ) {
      output ( { doc: sel } )
    }
  }
}
