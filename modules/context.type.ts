import { DataSignalsType } from './Data'

interface SignalsType {
  data: DataSignalsType
}

export interface ContextType {
  state: any
  input: any
  output: any
  signals: SignalsType
}
