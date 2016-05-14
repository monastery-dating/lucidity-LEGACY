import { DataSignalsType, DataServicesType } from './Data'

// Exported interface for signals (corresponds to inputs of
// first action in signal chains)
interface SignalsType {
  data: DataSignalsType
}

// We make services optional so that we can mock them
// during testing.
interface ServicesType {
  data?: DataServicesType
}

export interface ContextType {
  state?: any
  input?: any
  output?: any
  services?: ServicesType
  signals?: SignalsType
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
