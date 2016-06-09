import { db } from './services/db'
import { Db, AuthDBType } from './types/db.type'
import { dbChanged } from './signals/dbChanged'
import { reload } from './signals/reload'
import { save } from './signals/save'

export interface DataSignalsType {
  dbChanged ( any )
  reload ( any )
  save ( any ) // is this really used directly ?
  // saveDoc is only used by other signals
}

export interface DataServicesType {
  db?: Db
}

export const Data =
( options = {} ) => {
  return (module, controller) => {
    // This state is where we read and write to
    // the database
    module.addState
    ( { project: {}
      }
    )

    // This service is only used in Data actions.
    module.addServices
    ( { db
      }
    )

    module.addSignals
    ( { dbChanged
      , reload
      , save
      }
    )

    const changed = controller.getSignals ().data.dbChanged

    const r = db.changes
    ( { live: true
      , include_docs: true
      , since: 'now'
      }
    ).on ( 'change', ( change ) => changed ( { change } ) )
    // FIXME: could use r.cancel to stop listening to
    // changes

    return {} // meta information
  }
}
