export interface BlockSignalsType {
  add ( input: { pos: number, parentId: string, ownerType: string } )
  name ( input: { value: string } )
  select ( input: { _id: string } )
  source ( input: { value: string } )
}

export * from './helper/BlockHelper'
export * from './BlockType'
export * from './SlotType'

import * as Model from 'cerebral-model-baobab'
import { add } from './signals/add'
import { name } from './signals/name'
import { select } from './signals/select'
import { source } from './signals/source'

const CurrentBlock = Model.monkey
( { cursors:
    { blockById: [ 'data', 'block' ]
    , id: [ 'user', 'blockId' ]
    }
  , get ( data ) {
      const blockById = data.blockById || {}
      return blockById [ data.id ] || {}
    }
  }
)

export const Block =
( options = {} ) => {
  return (module, controller) => {
    // This state is where we read and write to
    // the database
    module.addState
    ( CurrentBlock
    )

    module.addSignals
    ( { add
      , name
      , select
      , source
      }
    )

    return {} // meta information
  }
}
