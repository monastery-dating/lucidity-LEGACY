export * from './actions/status'
import { StatusType } from './actions/status'

export interface StatusSignalsType {
  toggledDetail ( input: { detail: StatusType })
  changed ( input: { status: StatusType })
}

import { changed } from './signals/changed'
import { toggledDetail } from './signals/toggledDetail'

export const Status =
(options = {}) => {
  return (module, controller) => {
    module.addState
    ( { list: []
      , detail: {}
      , showDetail: false
      }
    )

    module.addSignals
    ( { changed
      , toggledDetail
      }
    )

    return {} // meta information
  }
}
