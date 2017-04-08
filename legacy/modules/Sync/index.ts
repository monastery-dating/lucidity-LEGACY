export * from './signals/start'
export * from './signals/stop'
export interface SyncSignalsType {
  changed ( opt: { type: string, message?: string } )
}

import { db } from '../Data/services/db'
import { changed } from './signals/changed'
import { SyncHelper } from './helper/SyncHelper'

export const Sync =
(options = {}) => {
  return (module, controller) => {
    module.addState
    ( { status: 'offline'
      }
    )

    module.addSignals
    ( { changed
      }
    )

    // SyncHelper.start ( { controller, db } )

    return {} // meta information
  }
}
