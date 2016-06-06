import { BlockByIdType } from '../Block'
import * as Model from 'cerebral-model-baobab'

const sortByName = ( a, b ) => a.name > b.name ? 1 : -1

const LibraryRows = Model.monkey
( { cursors:
    { blocks: [ 'data', 'lblock' ]
    }
  , get ( state ) {
      const blocks: BlockByIdType = state.blocks || {}
      const list = []
      for ( const k in blocks ) {
        list.push ( blocks [ k ] )
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
