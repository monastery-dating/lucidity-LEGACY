import {provide, OpaqueToken, Inject} from 'angular2/core'
// Here we create the immutable app state (Flux style)
import { Observable, BehaviorSubject, Subject } from 'rxjs'
import { FilesAction, FilesStoreType, observeFiles, initFilesStore } from '../workbench/index'
import { GraphAction, GraphStoreType, observeGraph, initGraphStore } from '../workbench/index'

import { initStateToken, stateToken, dispatcherToken } from './store.tokens'

export interface AppState {
  files: FilesStoreType
  graph: GraphStoreType
}

type Action = FilesAction | GraphAction

// We put it all together in a single state function.
// It comes with an initial state, observable actions and gives an observable
// application state.
function makeState
( initState: AppState
, actions: Observable<Action>
) : Observable<AppState> {

  const appStateObservable : Observable<AppState> =
  // observe Files
  observeFiles ( initState.files, actions )
  // observe Graph
  .zip ( observeGraph ( initState.graph, actions ) )
  // remap in a record corresponding to our AppState
  .map
  ( s =>
    ( { files: s [ 0 ], graph: s [ 1 ] } )
  )

  // On observer subscription, we want to send the current app state without
  // waiting for an action.
  const state = new BehaviorSubject ( initState )

  // app subscribes to changes in app state
  // and simply forwards the new state to its own subscribers
  // with 'next'.
  state.subscribe
  ( s => state.next ( s ) )

  return state
}


const store =
// The initial state
[ provide
  ( initStateToken
  , { useValue:
      { files: initFilesStore ()
      , graph: initGraphStore ()
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
  , { useFactory: makeState
    , deps:
      [ new Inject ( initStateToken )
      , new Inject ( dispatcherToken )
      ]
    }
  )
]

export default store
