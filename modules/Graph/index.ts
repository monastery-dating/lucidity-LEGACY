export * from './helper/BlockHelper'
export * from './helper/GraphHelper'
export * from './types'
export * from './helper/uimap'

export interface GraphSignalsType {
  add ( input: { pos: number, parentId: string } )
  select ( input: { id: string } )
}

import * as Model from 'cerebral-model-baobab'
import { BlockHelper, GraphHelper } from './helper'
import { mockGraph } from './mock/graph'
import { add } from './signals/add'
import { select } from './signals/select'

const CurrentGraph = Model.monkey
( { cursors:
    { graph: [ 'scene', 'graph' ]
    , blocksById: [ 'data', 'block' ]
    }
  , get ( data ) {
      const graph = data.graph
      const blocksById = data.blocksById
      if ( graph ) {
        return { nodes: graph.nodes
               , nodesById: graph.nodesById
               , blocksById
               }
      }
      else {
        const main = BlockHelper.create ( 'main', '' )
        const g = GraphHelper.create ( main )
        return { nodes: g.nodes
               , nodesById: g.nodesById
               , blocksById: { [ main._id ]: main }
               }
      }
    }
  }
)

export const Graph =
( options = {}) => {
  return (module, controller) => {
    const base =
    module.addState
    ( CurrentGraph
    )

    module.addSignals
    ( { add
      , select
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
