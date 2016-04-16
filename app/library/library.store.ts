import { Observable } from 'rxjs'

// Mutations
import { Action } from '../store/action.type'
import { LibraryAction } from './library.mutations'
import { LibraryStoreType } from './library.store.t'

// Observe mutations on Library and act on them.
// We just execute the 'mutate' action.
export const observeLibrary = function
( initState: LibraryStoreType
, actions: Observable<Action>
) : Observable<LibraryStoreType> {

  // scan emits each event in the actions. It takes an accumulator ( in // our case the initial or current state ) and returns a new value (a state).
  return actions.scan
  ( ( library, action) => {
      if ( action instanceof LibraryAction ) {
        return action.mutate ( library )
      }
      else {
        return library
      }
    }
  , initState
  )
}
