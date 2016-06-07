import { NodeHelper } from './NodeHelper'
import { GraphType, NodeType } from '../types'
import { BlockHelper, BlockType, SlotType } from '../../Block'

import { Immutable as IM } from './Immutable'

export module GraphHelper {

  const createNode  = NodeHelper.create
  const nextNodeId  = NodeHelper.nextNodeId
  const nextBlockId = BlockHelper.nextBlockId

  export const create =
  ( name: string = 'main'
  , source: string = BlockHelper.MAIN_SOURCE
  ) : GraphType => {
    const block = BlockHelper.create ( name, source )
    const nid =  NodeHelper.rootNodeId
    return Object.freeze
    ( { nodesById: Object.freeze
        ( { [ nid ]: createNode ( block.id, nid, null ) } )
      , blocksById: Object.freeze
        ( { [ block.id ]: block } )
      , blockId: block.id
      }
    )
  }

  const insertInGraph =
  ( newgraph: GraphType
  , oldgraph: GraphType
  , oldid: string
  , parentId: string
  , tail: { nid: string }
  , dropId?: string
  ) => {
    const oldnode = oldgraph.nodesById [ oldid ]
    let block = oldgraph.blocksById [ oldnode.blockId ]

    if ( !block [ '_copyblock' ] ) {
      const bid = nextBlockId ( newgraph.blocksById )
      block = Object.assign ( {}, block, { id: bid } )
      newgraph.blocksById [ bid ] = Object.freeze ( block )

      // make sure we do not add it twice (in case it's an alias)
      oldgraph.blocksById [ oldnode.blockId ] =
      Object.assign ( {}, block, { _copyblock: true } )
    }

    // our new node id
    const nid = nextNodeId ( newgraph.nodesById )
    // lock this id
    const node: NodeType =
    { id: nid
    , blockId: block.id
    , parent: parentId
    , children: []
    }

    newgraph.nodesById [ nid ] = node

    if ( !tail.nid && !oldnode.children [ 0 ] ) {
      // found tail
      tail.nid = nid
    }

    // map our children with new nodes and ids
    let nochild = true
    node.children = oldnode.children.map
    ( ( oid ) => {
        if ( oid === null || oid === dropId ) {
          return null
        }
        else {
          nochild = false
          return insertInGraph
          ( newgraph
          , oldgraph
          , oid
          , nid
          , tail
          , dropId
          )
        }
      }
    )

    if ( nochild ) {
      node.children = []
    }

    newgraph.nodesById [ nid ] = Object.freeze ( node )

    return nid
  }

  export const insert =
  ( graph: GraphType
  , parentId: string
  , pos: number
  , achild: GraphType
  ) : GraphType => {
    // add nodes
    let g = // not frozen to ease operations
    { nodesById: Object.assign  ( {}, graph.nodesById )
    , blocksById: Object.assign ( {}, graph.blocksById )
    , blockId: graph.blockId
    }

    const oldgraph =
    { nodesById: Object.assign  ( {}, achild.nodesById )
    , blocksById: Object.assign ( {}, achild.blocksById )
    }

    const tail = { nid: null }
    // copy nodes and rename ids
    const nid = insertInGraph
    ( g
    , oldgraph
    , NodeHelper.rootNodeId
    , parentId
    , tail
    )

    g.blockId = g.nodesById [ nid ].blockId

    // link in parent
    g = IM.update
    ( g, 'nodesById', parentId, 'children'
    , ( children ) => IM.insert ( children, pos, nid )
    )

    g = IM.update
    ( g, 'blocksById', Object.freeze ( g.blocksById )
    )

    return g
  }

  export const append = function
  ( graph: GraphType
  , parentId: string
  , child: GraphType
  ) : GraphType
  {
    return insert ( graph, parentId, -1, child )
  }

  // slip a new graph between parent and child
  // FIXME: need to detect deepest child on first slot in graph
  export const slip =
  ( graph: GraphType
  , parentId: string
  , pos: number
  , achild: GraphType
  ) : GraphType => {
    let g = // not frozen to ease operations
    { nodesById: Object.assign  ( {}, graph.nodesById )
    , blocksById: Object.assign ( {}, graph.blocksById )
    , blockId: graph.blockId
    }

    const oldgraph =
    { nodesById: Object.assign  ( {}, achild.nodesById )
    , blocksById: Object.assign ( {}, achild.blocksById )
    }

    const tail = { nid: null }
    // copy nodes and rename ids
    const nid = insertInGraph
    ( g
    , oldgraph
    , NodeHelper.rootNodeId
    , parentId
    , tail
    )

    g.blockId = g.nodesById [ nid ].blockId

    // get previous child at this position
    const parent = g.nodesById [ parentId ]
    const previd = parent.children [ pos ]
    const prevnode = g.nodesById [ previd ]

    // This is where the previous child will go
    const tailnode = g.nodesById [ tail.nid ]

    // tail.children [ 0 ] = previd
    const children = IM.aset ( tailnode.children, 0, previd )
    g = IM.update
    ( g, 'nodesById', tail.nid
    , Object.assign ( {}, tailnode, { children } )
    )

    // prevnode.parent = tail.nid
    g = IM.update
    ( g, 'nodesById', previd, 'parent', tail.nid )

    // parent.children [ pos ] = nid
    g = IM.update
    ( g, 'nodesById', parentId, 'children'
    , ( children ) => IM.aset ( children, pos, nid )
    )

    g = IM.update ( g, 'blocksById', Object.freeze ( g.blocksById ) )
    return Object.freeze ( g )
  }

  // Cut a branch a return the branch as a new graph.
  export const cut =
  ( graph: GraphType
  , nodeId: string
  ) : GraphType => {
    let g = // not frozen to ease operations
    { nodesById: {}
    , blocksById: {}
    , blockId: BlockHelper.rootBlockId
    }

    const oldgraph =
    { nodesById: Object.assign  ( {}, graph.nodesById )
    , blocksById: Object.assign ( {}, graph.blocksById )
    }

    const tail = { nid: null }
    insertInGraph
    ( g
    , oldgraph
    , nodeId
    , null
    , tail
    )

    return g
  }

  // Remove a branch and return the smaller tree.
  export const drop =
  ( graph: GraphType
  , nodeId: string
  ) : GraphType => {
    let g = // not frozen to ease operations
    { nodesById: {}
    , blocksById: {}
    , blockId: BlockHelper.rootBlockId
    }

    const oldgraph =
    { nodesById: Object.assign  ( {}, graph.nodesById )
    , blocksById: Object.assign ( {}, graph.blocksById )
    }

    const tail = { nid: null }
    insertInGraph
    ( g
    , oldgraph
    , NodeHelper.rootNodeId
    , null
    , tail
    , nodeId
    )

    return g
  }

}
