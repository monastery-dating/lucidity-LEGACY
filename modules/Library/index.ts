export * from './helper'

import { SceneByIdType } from '../Scene'
import * as Model from 'cerebral-model-baobab'

const sortByName = ( a, b ) => a.name > b.name ? 1 : -1

const LibraryRows = Model.monkey
( { cursors:
    { components: [ 'data', 'component' ]
    }
  , get ( state ) {
      const components: SceneByIdType = state.components || {}
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
    ( {
      }
    )

    return {} // meta information
  }
}
