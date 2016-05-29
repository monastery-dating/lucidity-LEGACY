import { BlockSignalsType } from './Block'
import { DataSignalsType, DataServicesType } from './Data'
import { FactorySignalsType } from './Factory'
import { ProjectSignalsType } from './Project'
import { SceneSignalsType, SceneHelperType } from './Scene'
import { StatusSignalsType } from './Status'
import { SyncSignalsType } from './Sync'

export interface SignalsType {
  block: BlockSignalsType
  data: DataSignalsType
  $factory: FactorySignalsType
  project: ProjectSignalsType
  scene: SceneSignalsType
  $status: StatusSignalsType
  $sync: SyncSignalsType
}

// We make services optional so that we can mock them
// during testing.
interface ServicesType {
  data?: DataServicesType
  scene?: SceneHelperType
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
