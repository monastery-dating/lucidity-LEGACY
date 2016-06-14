import { NodeHelper } from './NodeHelper'
import { GraphType, NodeType, NodeByIdType } from '../types'
import { BlockHelper, BlockType, PlaybackMetaType, SlotType } from '../../Block'
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
  , context: any = PlaybackHelper.mainContextProvide
  , nodeId: string = rootNodeId
  , allvoid: string[] = []
  , parentError: string = null
  , shouldBeVoid: boolean = false
  ): boolean => {
    let node: NodeType = graph.nodesById [ nodeId ]
    const block = graph.blocksById [ node.blockId ]
    const meta: PlaybackMetaType = block.meta
    const expect = meta.expect || {}
    const cerr = parentError ? [ parentError ] : []
    let voidUpdateError = false
    let all: string[] = []

    if ( shouldBeVoid && meta.update ) {
      cerr.push ( `invalid 'update' (should not be typed)` )
      voidUpdateError = true
    }

    for ( const k in meta.expect ) {
      const e = expect [ k ]
      const c = context [ k ]
      if ( !c ) {
        cerr.push
        ( `missing '${k}': ${e}`)
      }
      else if ( e !== c ) {
        cerr.push
        ( `invalid '${k}': ${c} instead of ${e}` )
      }
    }

    const childrenTypes = meta.children
    const children = node.children
    let childrenm: string[]
    const nodesById = graph.nodesById
    const blocksById = graph.blocksById
    const serr = []
    if ( childrenTypes ) {
      for ( let i = 0; i < childrenTypes.length; ++i ) {
        const e = childrenTypes [ i ]
        const n = nodesById [ children [ i ] ]
        let b
        if ( n ) {
          b = blocksById [ n.blockId ]
        }
        if ( !b ) {
          serr [ i ] = `missing child ${i+1}: ${e}`
        }
        else {
          let c = b.meta.update
          if ( !c ) {
            // try to find child in grand-children
            if ( !childrenm ) {
              childrenm = Object.assign ( [], children )
            }

            let nc = n
            while ( !c && nc ) {
              const childId = nc.children [ 0 ]
              nc = null
              if ( childId ) {
                nc = nodesById [ childId ]
                if ( nc ) {
                  const b = blocksById [ nc.blockId ]
                  const u = b.meta.update
                  if ( u ) {
                    // found child (will check if type is correct)
                    childrenm [ i ] = childId
                    c = u
                  }
                }
              }
            }
          }

          if ( e !== c ) {
            serr [ i ] = `invalid child ${i+1}: ${c} instead of ${e}`
          }
        }
      }
    }

    const valid = cerr.length === 0 && serr.length === 0

    if ( valid ) {
      if ( block.meta.isvoid ) {
        // add ourself to the capturing of void updates
        all.push ( nodeId )
      }
      // valid
      node =
      { id: nodeId
      , blockId: node.blockId
      , parent: node.parent
      , children
      }
      if ( childrenTypes ) {
        // Only set direct children for helper if we have explicit
        // types for them.
        node.childrenm = childrenm || children
      }
      if ( block.meta.all ) {
        // grab our own list of nodes
        all = []
        node.all = all
      }
    }
    else {
      // invalid
      node =
      { id: nodeId
      , blockId: node.blockId
      , parent: node.parent
      , children
      , invalid: true
      , cerr
      , serr
      }
    }

    const sub = context.set ( meta.provide || {} )

    const perror = node.invalid ?
      `Parent '${block.name}' invalid.` : null

    const inlen = childrenTypes ? childrenTypes.length : null
    for ( let i = 0; i < children.length; ++i ) {
      const childId = children [ i ]
      if ( childId ) {
        if ( inlen ) {
          // Typed children
          const err = i >= inlen ? `Not linked to parent: detached` : null
          check ( graph, sub, childId, all, err || perror )
          if ( !node.invalid ) {
            // valid node
            const n = nodesById [ childId ]
            if ( n.invalid ) {
              // Invalid typed child: we become invalid as well
              node.invalid = true
              node.serr = [ `invalid child ${i+1}` ]
            }
          }
        }
        else {
          // No type definitions for children: update must have '():void' type.
          if ( check ( graph, sub, childId, all, perror, true ) ) {
            serr [ i ] = `invalid child ${i+1}: update is typed`
          }
        }
      }
    }

    graph.nodesById [ nodeId ] = Object.freeze ( node )

    if ( !block.meta.all && !node.invalid ) {
      // node is valid and does not capture `isvoid` children.
      // Add new elements in all to allvoid.
      for ( const nid of all ) {
        allvoid.push ( nid )
      }
    }

    return voidUpdateError
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
