import {provide, OpaqueToken, Inject} from 'angular2/core'
// Here we create the immutable app state (Flux style)
import {Observable, BehaviorSubject, Subject} from 'rxjs'

const merge = function<T extends S, S>
( t: T, s: S ) : T {
  const res: any = {}
  // copy
  for ( const k in t ) {
    if ( t.hasOwnProperty ( k ) ) {
      res [ k ] = t [ k ]
    }
  }
  // merge
  for ( const k in s ) {
    if ( s.hasOwnProperty ( k ) ) {
      res [ k ] = s [ k ]
    }
  }
  return res
}

export interface Todo {
  id: number
  text: string
  completed: boolean
}

export interface AppState {
  todos: Todo[]
  visibilityFilter: string
}

// Mutations
class AddTodo {
  constructor
  ( public todoId: number
  , public text: string
  ) {}
}

class ToggleTodo {
  constructor
  ( public todoId: number
  ) {}
}

export class SetVisibilityFilter {
  constructor
  ( public filter: string
  ) {}
}

// This is all our app can do
export type Action = AddTodo | ToggleTodo | SetVisibilityFilter

// Create observable from initial state

// Observe mutations on todo list
const observeTodos = function
( initState: Todo[]
, actions: Observable<Action>
) : Observable<Todo[]> {

  // scan emits each event in the actions. It takes an accumulator ( in // our case the initial or current state ) and returns a new value (a state).
  return actions.scan
  ( ( state, action) => {
      if ( action instanceof AddTodo ) {
        // create a Todo
        const newTodo =
        { id: action.todoId, text: action.text, completed: false }
        return [ ...state, newTodo ]
      }
      else {
        // Observe mutations on individual elements
        return state.map ( t => updateTodo ( t, action ) )
      }
    }
  , initState
  )
}

// Update a todo from an action
const updateTodo = function
( todo : Todo
, action: Action
) : Todo {

  if ( action instanceof ToggleTodo && action.todoId == todo.id ) {
    return merge ( todo, { completed: !todo.completed } )
  }
  else {
    return todo
  }
}

// Observe mutations on filter and produce new filter state.
const observeFilter = function
( initState: string
, actions: Observable<Action>
) : Observable<string> {

  // From a list of actions, we emit filter changes. We could add debounce with
  // actions.debounce ( 300 ).scan ( ... )
  // http://www.sitepoint.com/functional-reactive-programming-rxjs/
  return actions.scan
  ( ( state, action ) => {
      if ( action instanceof SetVisibilityFilter ) {
        return action.filter
      }
      else {
        return state
      }
    }
  , initState
  )
}

// And now let's put all this together in a single state function
// It comes with an initial state, observable actions and gives an observable
// application state:
function stateFn
( initState: AppState
, actions: Observable<Action>
) : Observable<AppState> {

  const appStateObservable : Observable<AppState> =
  // observe Todos
  observeTodos ( initState.todos, actions )
  // add observe Filter
  .zip ( observeFilter ( initState.visibilityFilter, actions ) )
  // remap in a record corresponding to our AppState
  .map ( s => ( { todos: s [ 0 ], visibilityFilter: s [ 1 ] } ) )

  // On observer subscription, we want to send the current app state without
  // waiting for an action.
  const appBehaviorSubject = new BehaviorSubject ( initState )

  // appBehaviorSubject subscribes to changes in app state
  // and simply forwards the new state to its own subscribers
  // with 'next'.
  appStateObservable.subscribe
  ( s => appBehaviorSubject.next ( s ) )

  return appBehaviorSubject
}

// Wrap the this into opaque structures before passing it
// to our components with providers.
export const initStateToken = new OpaqueToken ( 'initState' )
export const stateToken = new OpaqueToken ( 'state' )
export const dispatcherToken = new OpaqueToken ( 'dispatcher' )

const store =
// The initial state
[ provide
  ( initStateToken
  , { useValue:
      { todos:
        [ { id: 1, text: 'foo', completed: false }
        ]
      , visibilityFilter: 'SHOW_ALL'
      }
    }
  )
// A dispatcher which is both an observable and an observer
, provide
  ( dispatcherToken
  , { useValue: new Subject<Action> ( null )
    }
  )
// Observable app state
, provide
  ( stateToken
  , { useFactory: stateFn
    , deps:
      [ new Inject ( initStateToken )
      , new Inject ( dispatcherToken )
      ]
    }
  )
]

export default store
