export * from './actions/status'

import { changed } from './signals/changed'

export const Status =
(options = {}) => {
  return (module, controller) => {
    module.addState
    ( []
    )

    module.addSignals
    ( { changed
      }
    )

    return {} // meta information
  }
}
