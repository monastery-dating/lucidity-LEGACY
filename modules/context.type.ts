import { DataSignalsType, DataServicesType } from './Data'
import { FactorySignalsType } from './Factory'
import { SceneSignalsType } from './Scene'

// Exported interface for signals (corresponds to inputs of
// first action in signal chains)
export interface SignalsType {
  data: DataSignalsType
  $factory: FactorySignalsType
  scene: SceneSignalsType
}

// We make services optional so that we can mock them
// during testing.
interface ServicesType {
  data?: DataServicesType
}

export interface ContextType {
  state?: any
  input?: any
  props?: any
  output?: any
  services?: ServicesType
  signals?: SignalsType
  children?: any[]
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
