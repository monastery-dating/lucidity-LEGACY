import { DataSignalsType, DataServicesType } from './Data'
import { FactorySignalsType } from './Factory'
import { SceneSignalsType } from './Scene'
import { StatusSignalsType } from './Status'

// Exported interface for signals (corresponds to inputs of
// first action in signal chains)
export interface SignalsType {
  data: DataSignalsType
  $factory: FactorySignalsType
  scene: SceneSignalsType
  $status: StatusSignalsType
}

// We make services optional so that we can mock them
// during testing.
interface ServicesType {
  data?: DataServicesType
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
  services: ServicesType
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
