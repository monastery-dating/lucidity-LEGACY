import { Observable, Observer } from 'rxjs'
import { AppState } from './store/index'
import { Action } from './store/action.type'

export { stateToken, dispatcherToken } from './store/store.tokens'
export type AppStateObservable = Observable<AppState>
export type DispatcherType = Observer<Action>
