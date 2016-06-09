import { NodeHelper } from './NodeHelper'
import { GraphType, NodeType, NodeByIdType } from '../types'
import { BlockHelper, BlockType, SlotType } from '../../Block'
import { PlaybackHelper } from '../../Playback'

import { Immutable as IM } from './Immutable'

const rootNodeId = NodeHelper.rootNodeId
const defaultMeta = PlaybackHelper.defaultMeta

export module GraphHelper {

  const createNode  = NodeHelper.create
  const nextNodeId  = NodeHelper.nextNodeId
  const nextBlockId = BlockHelper.nextBlockId

  const checkFreeze =
  ( graph: GraphType
  ) => {
    if ( Object.isFrozen ( graph ) ) {
      graph =
      { nodesById: Object.assign ( {}, graph.nodesById )
      , blocksById: graph.blocksById
      }
    }
    else {
      graph.blocksById = Object.freeze ( graph.blocksById )
    }

    check ( graph ) // this will freeze nodes
    graph.nodesById = Object.freeze ( graph.nodesById )
    return Object.freeze ( graph )
  }

  const check =
  ( graph: GraphType
  , context: any = PlaybackHelper.mainContext
  , nodeId: string = rootNodeId
  , invalid: string[] = []
  ) => {
    let node: NodeType = graph.nodesById [ nodeId ]
    const meta = graph.blocksById [ node.blockId ].meta || defaultMeta
    const expect = meta.expect || {}
    const errors = [...invalid]
    for ( const k in meta.expect ) {
      const e = expect [ k ]
      const c = context [ k ]
      if ( !c ) {
        errors.push
        ( `missing '${k}' (${e})`)
      }
      else if ( e !== c ) {
        errors.push
        ( `invalid '${k}' (${c} instead of ${e})` )
      }
    }

    if ( Object.isFrozen ( node ) ) {
      if ( errors.length > 0 ) {
        node =
        { id: node.id
        , blockId: node.blockId
        , parent: node.parent
        , children: node.children
        , invalid: errors
        }
      }
      else if ( !node.invalid ) {
      } else {
        node =
        { id: node.id
        , blockId: node.blockId
        , parent: node.parent
        , children: node.children
        }
      }
    }

    else {
      if ( errors.length > 0 ) {
        node.invalid = errors
      }
      else {
        delete node.invalid
      }
    }

    graph.nodesById [ nodeId ] = Object.freeze ( node )

    const sub = context.set ( meta.provide || {} )

    for ( const childId of node.children ) {
      if ( childId ) {
        check ( graph, sub, childId, errors )
      }
    }
  }

  export const create =
  ( name: string = 'main'
  , source: string = BlockHelper.MAIN_SOURCE
  ) : GraphType => {
    const block = BlockHelper.create ( name, source )
    const nid =  rootNodeId
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

    newgraph.nodesById [ nid ] = node

    return nid
  }

  const copyNodes =
  ( nodesById: NodeByIdType
  ) => {
    const r = {}
    for ( const k in nodesById ) {
      r [ k ] = Object.assign ( {}, nodesById [ k ] )
    }
    return r
  }

  export const insert =
  ( graph: GraphType
  , parentId: string
  , pos: number
  , achild: GraphType
  ) : GraphType => {
    // add nodes
    let g = // not frozen to ease operations
    { nodesById: copyNodes ( graph.nodesById )
    , blocksById: Object.assign ( {}, graph.blocksById )
    , blockId: graph.blockId
    }

    const oldgraph =
    { nodesById: achild.nodesById
      // we write in there during insertInGraph to mark
      // transfered blocks
    , blocksById: Object.assign ( {}, achild.blocksById )
    }

    const tail = { nid: null }
    // copy nodes and rename ids
    const nid = insertInGraph
    ( g
    , oldgraph
    , rootNodeId
    , parentId
    , tail
    )

    g.blockId = g.nodesById [ nid ].blockId

    // link in parent
    const parent = g.nodesById [ parentId ]
    parent.children = IM.insert ( parent.children, pos, nid )

    return checkFreeze ( g )
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
    { nodesById: copyNodes ( graph.nodesById )
    , blocksById: Object.assign ( {}, graph.blocksById )
    , blockId: graph.blockId
    }

    const oldgraph =
    { nodesById: achild.nodesById
    , blocksById: Object.assign ( {}, achild.blocksById )
    }

    const tail = { nid: null }
    // copy nodes and rename ids
    const nid = insertInGraph
    ( g
    , oldgraph
    , rootNodeId
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
    tailnode.children = IM.aset ( tailnode.children, 0, previd )

    prevnode.parent = tail.nid

    // parent.children [ pos ] = nid
    parent.children = IM.aset ( parent.children, pos, nid )

    return checkFreeze ( g )
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
    { nodesById: graph.nodesById
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

    return checkFreeze ( g )
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
    { nodesById: graph.nodesById
    , blocksById: Object.assign ( {}, graph.blocksById )
    }

    const tail = { nid: null }
    insertInGraph
    ( g
    , oldgraph
    , rootNodeId
    , null
    , tail
    , nodeId
    )

    return checkFreeze ( g )
  }


  interface FileExport {
    ( folderHelper: any, name: string, source: string ): void
  }

  interface FolderExport {
    ( folderHelper: any, name: string ): any
  }

  const exportOne =
  ( graph: GraphType
  , context: any
  , file: FileExport
  , folder: FolderExport
  , nodeId: string
  , slotref?: string
  ) => {
    const node = graph.nodesById [ nodeId ]
    const block = graph.blocksById [ node.blockId ]
    const name = slotref ? `${slotref}.${block.name}` : block.name
    file ( context, `${name}.ts`, block.source )
    let sub
    const children = node.children
    for ( let i = 0; i < children.length; ++i ) {
      const slotref = i < 10 ? `0${i}` : String ( i )
      const childId = children [ i ]
      if ( childId ) {
        if ( !sub ) {
          // create folder for children
          sub = folder ( context, name )
        }
        exportOne ( graph, sub, file, folder, childId, slotref )
      }
    }
  }

  export const exportGraph =
  ( graph: GraphType
  , context: any // this is the context passed for root element
  , file: FileExport
  , folder: FolderExport
  ) => {
    exportOne ( graph, context, file, folder, rootNodeId )
  }

  export const updateSource =
  ( graph: GraphType
  , blockId: string
  , source: string
  ) => {
    const oblock = graph.blocksById [ blockId ]
    const block = BlockHelper.update ( oblock, { source } )
    const g = IM.update ( graph, 'blocksById', blockId, block )
    // FIXME: checkFreeze
    return checkFreeze ( g )
  }
}
