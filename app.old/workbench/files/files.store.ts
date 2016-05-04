import { Observable } from 'rxjs'

// Mutations
import { Action } from '../../store/action.type'
import { FilesAction } from './files.mutations'
import { FilesStoreType } from './files.store.type'

// Observe mutations on files and act on them.
// We just execute the 'mutate' action.
export const observeFiles = function
( initState: FilesStoreType
, actions: Observable<Action>
) : Observable<FilesStoreType> {

  // scan emits each event in the actions. It takes an accumulator ( in // our case the initial or current state ) and returns a new value (a state).
  return actions.scan
  ( ( files, action) => {
      if ( action instanceof FilesAction ) {
        return action.mutate ( files )
      }
      else {
        return files
      }
    }
  , initState
  )
}
