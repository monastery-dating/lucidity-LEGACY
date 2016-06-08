import { BlockSignalsType } from './Block'
import { DataSignalsType, DataServicesType } from './Data'
import { DragDropSignalsType } from './DragDrop'
import { FactorySignalsType } from './Factory'
import { LibrarySignalsType } from './Library'
import { ProjectSignalsType } from './Project'
import { SceneSignalsType, SceneHelperType } from './Scene'
import { StatusSignalsType } from './Status'
import { SyncSignalsType } from './Sync'
import { UserSignalsType } from './User'

interface RouterServicesType {
  // get url from signal name and payload
  getSignalUrl ( signalName: string, payload?: any ): string
  // go to signal
  redirectToSignal ( signalName: string, payload?: any ):void

  // get routable part of current url
  getUrl (): string
  // go to url
  redirect ( url: string, opts?: any ): void
}

export interface SignalsType {
  block: BlockSignalsType
  data: DataSignalsType
  $dragdrop: DragDropSignalsType
  $factory: FactorySignalsType
  library: LibrarySignalsType
  project: ProjectSignalsType
  scene: SceneSignalsType
  $status: StatusSignalsType
  $sync: SyncSignalsType
  user: UserSignalsType
}

// We make services optional so that we can mock them
// during testing.
interface ServicesType {
  data?: DataServicesType
  scene?: SceneHelperType
  router?: RouterServicesType
}

export interface StateType {
  get ( path: string[] )
  set ( path: string[], value: any )
  unset ( path: string[] )
}

// We mark fields as optional to ease testing mock.
export interface ActionContextType {
  state?: StateType
  input?: any
  output?: any
  services?: ServicesType
}

export interface ContextType {
  services?: ServicesType
  state: any
  props: any
  signals: SignalsType
  children: any[]
}

// Generic types
interface Action {
  ( context: ContextType ): void
}

interface Path {
  [ key: string ]: SignalType
}

type SignalElement = Action | Path
export type SignalType = SignalElement[]
