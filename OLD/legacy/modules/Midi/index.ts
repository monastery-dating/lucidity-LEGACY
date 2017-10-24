import * as Model from 'cerebral-model-baobab'
import { init } from './signals/init'

export * from './helper/MidiHelper'
export interface MidiSignalsType {
  init (): void
}

export const Midi =
( options = {} ) => {
  return ( module, controller ) => {
    module.addState
    (
    )

    module.addSignals
    ( { init
      }
    )

    return {} // meta information
  }
}
