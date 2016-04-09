import { Observable } from 'rxjs'

// Mutations
import { GraphAction } from './graph.mutations'
import { GraphStoreType } from './graph.store.type'

// Observe mutations on files and act on them.
// We just execute the 'mutate' action.
export const observeGraph = function
( initState: GraphStoreType
, actions: Observable<GraphAction>
) : Observable<GraphStoreType> {

  // scan emits each event in the actions. It takes an accumulator ( in // our case the initial or current state ) and returns a new value (a state).
  return actions.scan
  ( ( graph, action) => action.mutate ( graph )
  , initState
  )
}
