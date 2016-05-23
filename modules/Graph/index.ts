export * from './helper/uimap'
export * from './types'

export interface GraphSignalsType {
  add ( input: { pos: number, parentId: string } )
}

import { mockGraph } from './mock/graph'
import { add } from './signals/add'

export const Graph =
( options = {}) => {
  return (module, controller) => {
    module.addState
    ( mockGraph
    )

    module.addSignals
    ( { add
      }
    )

    return {} // meta information
  }
}

// data/scene/[_id] graph: { full graph }
// data/block/[_id] Block storage

// The full graph is:
/*
{ nodes: string[]
  nodeById: NodeByIdType
}
*/
// ==> graph changes ==> scene save
// ==> block changes ==> block save. OK.
