import { NodeHelper } from './NodeHelper'
import { GraphType, NodeType } from '../types'
import { BlockType, SlotType } from '../../Block'

import { Immutable as IM } from './Immutable'

export module GraphHelper {

  const createNode = NodeHelper.create
  const nextNodeId = NodeHelper.nextNodeId

  export const create =
  ( block: BlockType
  ) : GraphType => {
    const id =  NodeHelper.rootNodeId
    return Object.freeze
    ( { nodesById: Object.freeze
        ( { [ id ]: createNode ( block._id, id, null ) } )
      , nodes: Object.freeze ( [ id ] )
      }
    )
  }

  export const insert = function
  ( graph: GraphType
  , parentId: string
  , pos: number
  , child: BlockType
  ) : GraphType
  {
    const id = nextNodeId ( graph.nodesById )
    let g = graph
    // new information for the added element
    g = IM.update
    ( g, 'nodesById', id
    , createNode ( child._id, id, parentId )
    )

    g = IM.update
    ( g, 'nodesById', parentId, 'children'
    , ( children ) => IM.insert ( children, pos, id )
    )

    g = IM.update ( g, 'nodes'
    , ( nodes ) => IM.append ( nodes, id )
    )

    return g
  }

  export const append = function
  ( graph: GraphType
  , parentId: string
  , child: BlockType
  ) : GraphType
  {
    return insert ( graph, parentId, -1, child )
  }

  // slip a new object between parent and child
  export const slip = function
  ( graph: GraphType
  , parentId: string
  , pos: number
  , child: BlockType
  ) : GraphType
  {
    const id = nextNodeId ( graph.nodesById )
    let g = graph

    // get previous child at this position
    const parent = g.nodesById [ parentId ]
    const elder = parent.children [ pos ]
    const children = elder ? [ elder ] : []

    // move elder in child.children
    g = IM.update
    ( g, 'nodesById', id
    , createNode ( child._id, id, parentId, children )
    )

    // change elder parent
    g = IM.update
    ( g, 'nodesById', elder, 'parent', id )

    // replace parent child
    g = IM.update
    ( g, 'nodesById', parentId, 'children'
    , ( children ) => IM.aset ( children, pos, id )
    )

    // add new child in nodes list
    g = IM.update ( g, 'nodes'
    , ( nodes ) => IM.append ( nodes, id )
    )

    return g
  }

}
