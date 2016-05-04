import { Observable } from 'rxjs'

// Mutations
import { Action } from '../../store/action.type'
import { GraphAction } from './graph.mutations'
import { GraphStoreType } from './graph.store.type'

// Observe mutations on files and act on them.
// We just execute the 'mutate' action.
export const observeGraph = function
( initState: GraphStoreType
, actions: Observable<Action>
) : Observable<GraphStoreType> {

  // scan emits each event in the actions. It takes an accumulator ( in // our case the initial or current state ) and returns a new value (a state).
  return actions.scan
  ( ( graph, action) => {
      if ( action instanceof GraphAction ) {
        return action.mutate ( graph )
      }
      else {
        return graph
      }
    }
  , initState
  )
}
