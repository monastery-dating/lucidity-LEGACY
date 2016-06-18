export * from './helper/PlaybackHelper'
export interface PlaybackSignalsType {
  mode ( { mode: string } )
}

import { mode } from './signals/mode'

export const Playback =
( options = {} ) => {
  return (module, controller) => {
    module.addState
    ( { mode: 'normal'
      }
    )

    module.addSignals
    ( { mode
      }
    )

    return {} // meta information
  }
}
