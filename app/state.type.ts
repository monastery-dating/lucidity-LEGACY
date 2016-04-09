import { Observable, Observer } from 'rxjs'
import { AppState, Action } from './store/index'

export { stateToken, dispatcherToken } from './store/store.tokens'
export type AppStateObservable = Observable<AppState>
export type DispatcherType = Observer<Action>
