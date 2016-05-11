import db from './services/db'
import dbChanged from './signals/dbChanged'

export default ( { tree } ) => {
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
      }
    )
    const changed =
    controller.getSignals ().data.dbChanged

    const r = db.changes
    ( { live: true
      , include_docs: true
      , since: 'now'
      }
    ).on ( 'change', changed )
    // FIXME: could use r.cancel to stop listening to
    // changes

/*
    const project = tree.select ( [ 'data' ] )
    const signals = controller.getSignals ()
    project.on
    ( 'update', ( e ) => {
        console.log ( 'DATA UPDATE', e.data.currentData )
        // signals.data.saveProject ( {} )
      }
    )
    */

    return {} // meta information
  }
}
