// Exposed actions and signals from Data (used directly in other signals composition)
export * from './signals/reload'
export * from './signals/save'

import { db } from './services/db'
import { dbChanged } from './signals/dbChanged'
import { reload } from './signals/reload'
import { save } from './signals/save'
import { selected } from './signals/selected'

export interface DataSignalsType {
  dbChanged ( any )
  reload ( any ) // TODO: rename reloaded or attached or ...
  save ( any )   // TODO: where is this used, rename to
                 //       dataChanged, or ...
  selected ( opts: { select: { type: string, _id: string } } )
}

interface Document {
  _id: string
  type: string
}

interface Callback {
  ( err: string ): void
}

// we make functions optional for mock in testing
interface Db {
  put? ( doc: Document, clbk: Callback )
  bulkDocs? ( docs: Document[], clbk: Callback )
}

export interface DataServicesType {
  db: Db
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
      , selected
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
