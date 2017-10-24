export * from './helper'

export interface LibrarySignalsType {
  zip ()
}

import { ComponentByIdType } from '../Graph'
import * as Model from 'cerebral-model-baobab'
import { zip } from './signals/zip'

const sortByName = ( a, b ) => a.name > b.name ? 1 : -1

const LibraryRows = Model.monkey
( { cursors:
    { components: [ 'data', 'component' ]
    }
  , get ( state ) {
      const components: ComponentByIdType = state.components || {}
      const list = []
      for ( const k in components ) {
        list.push ( components [ k ] )
      }
      list.sort ( sortByName )
      return list
    }
  }
)

export const Library =
( options = {} ) => {
  return (module, controller) => {
    module.addState
    ( { $rows: LibraryRows
      }
    )

    module.addSignals
    ( { zip
      }
    )

    return {} // meta information
  }
}
