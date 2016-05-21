export * from './helper/uimap'
export * from './types'

import { mockGraph } from './mock/graph'

export const Graph =
( options = {}) => {
  return (module, controller) => {
    module.addState
    ( mockGraph
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
