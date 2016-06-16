import { BlockByIdType } from '../../Block'
import { GraphType, NodeHelper } from '../../Graph'
import { MidiHelper } from '../../Midi'
import { Block, Helpers, Control } from '../types/lucidity'
import { ControlHelper , PlaybackControl } from './ControlHelper'
import * as esprima from 'esprima'
import * as escodegen from 'escodegen'

const SCRUBBER_VAR = '$scrub$'
// FIXME: how to avoid global like this ?
const wscrub = { values: [], init () {} }
window [ 'LUCY_SCRUB' ] = wscrub

const midi = MidiHelper.midiState ()

// This is the context defined before calling main.
export const MAIN_CONTEXT =
// midiState contains values for current ctrl and notes
{ midi: 'midi.State'
}

const rootNodeId = NodeHelper.rootNodeId

const DUMMY =
{ 'text:string': 'dummy.emptyText'
}

export interface PlaybackRender {
  (): void
}

interface RenderContext {
  // camera, time...
  [ key: string ]: any
}

type HelpersContext = Helpers

interface InitFunc {
  ( helpers: HelpersContext ): Object
}

interface UpdateFunc {
  ( ...any ): any
}

type NodeExports = Block

interface NodeCache {
  // Functions defined by js code
  exports: NodeExports
  // Cached values from 'init' calls. Only exists if there is an
  // init function (removed if init is removed).
  cache?: Object
  // to check cache.
  js: string
  // scrubbing
  scrubjs?: string // js source for scrubbing
  scrubjsOrig?: string // to check cache.
  scrubber?: number[]
  // We save the init context so that we can use it when detaching
  helpers?: Helpers
  control?: Control
  controls?: PlaybackControl[]
}

interface PlaybackNodeCache {
  [ key: string ]: NodeCache
}

export interface PlaybackCache {
  nodecache: PlaybackNodeCache
  // scrubbing block id
  scrub?: string

  main?: UpdateFunc
  // Current graph. We use this to diff and detect
  // nodes to detach.
  graph?: GraphType
}

const DUMMY_INPUT = () => null

const replaceWithScrubber =
( literals: number[]
, value
): Object => {
  const idx = literals.push ( value ) - 1
  return { type: 'MemberExpression'
         , computed: true
         , object:
           { type: 'Identifier'
           , name: SCRUBBER_VAR
           }
         , property: { type: 'Literal', value: idx }
         }
}

export module PlaybackHelper {

  const scrubTraverse =
  ( tree
  , literals: number[] //LiteralScrub[]
  ) => {
    if ( Array.isArray ( tree ) ) {
      // ensure order
      for ( let i = 0; i < tree.length; ++i ) {
        const b = tree [ i ]
        if ( b && typeof b === 'object' ) {
          if ( b.type === 'Literal' && typeof b.value === 'number' ) {
            // we check value type because
            // 'use strict' shows as literal number...
            tree [ i ] = replaceWithScrubber ( literals, b.value )
          }
          else {
            scrubTraverse ( b, literals )
          }
        }
      }
    }

    else {
      for ( const k in tree ) {
        const b = tree [ k ]
        if ( b && typeof b === 'object' ) {
          if ( b.type === 'UnaryExpression'
            && b.argument.type === 'Literal' ) {
            const arg = b.argument
            tree [ k ] = replaceWithScrubber ( literals, - arg.value )
          } else if ( b.type === 'Literal' && typeof b.value === 'number' ) {
            tree [ k ] = replaceWithScrubber ( literals, b.value )
          }
          else {
            scrubTraverse ( b, literals )
          }
        }
      }
    }
  }

  export const scrubParse =
  ( source: string
  , literals: number[] // LiteralScrub[]
  ): string => {
    const tree = esprima.parse ( source )
    scrubTraverse ( tree, literals )
    return escodegen.generate ( tree )
  }

  const updateCache =
  ( graph: GraphType
  , cache: PlaybackCache
  ) => {
    const nodecache = cache.nodecache
    const scrub = cache.scrub

    for ( const nodeId in graph.nodesById ) {

      const node = graph.nodesById [ nodeId ]
      if ( !node ) {
        throw ( `Error in graph: missing '${nodeId}'.`)
      }
      const block = graph.blocksById [ node.blockId ]

      let n = nodecache [ nodeId ]

      if ( node.invalid ) {
        // ignore
        continue
      }

      let js = block.js

      if ( node.blockId === scrub ) {
        if ( !n.scrubjs || js !== n.scrubjsOrig ) {
          // update scrubjs
          n.scrubjsOrig = js
          n.scrubber = []
          n.scrubjs = scrubParse ( js, n.scrubber )
        }
        // Use special 'scrubbing' js.
        js = n.scrubjs
        // We need to set a global for the editor to have
        // direct access.
        wscrub.values = n.scrubber
      }

      if ( !n || n.js !== js ) {
        if ( !n ) {
          n = nodecache [ nodeId ] = <NodeCache> { exports: {} }
        }
        else {
          // clear
          n.exports = {}
        }

        const exports = n.exports
        try {
          const codefunc = new Function ( 'exports', SCRUBBER_VAR, js )
          // We now run the code. The exports is the cache.
          codefunc ( exports, n.scrubber )
          n.js = block.js
        }
        catch ( err ) {
          // TODO: proper error handling
          console.log ( `${block.name} error: ${ err }`)

        }
        if ( block.meta.update && !exports.update ) {
          exports.update = () => { console.log ( `${block.name} error: has update type '${block.meta.update}' but no update function.`) }
        }
      }
    }
    // Now every updating node is ready for runtime
  }

  const detach =
  ( cache: PlaybackCache
  , oldgraph: GraphType
  , newgraph: GraphType
  , helpers: HelpersContext
  , nodeId: string
  , parentDisconnected: boolean
  ) => {
    const onode = oldgraph.nodesById [ nodeId ]
    const nnode = newgraph.nodesById [ nodeId ]
    let detached = parentDisconnected
                        || !nnode // = removed
                        || nnode.parent !== onode.parent

    // Parse children
    for ( const childId of onode.children ) {
      if ( childId ) {
        detach ( cache, oldgraph, newgraph, helpers, childId, detached )
      }
    }

    // detach after children (depth-first)
    if ( detached ) {
      const nc = cache.nodecache [ nodeId ]
      const init = nc.exports.init
      if ( init ) {
        // clear previous controls
        nc.controls = []
        try {
          init ( nc.helpers )
        }
        catch (err) {
          // FIXME: proper error handling
          console.log ( 'detach error:', err )
        }
        // clear cache
        nc.cache = {}
        // clear controls
        nc.controls = []
      }
    }
  }

  const initDo =
  ( cache: PlaybackCache
  , graph: GraphType
  , context: Context
  , ohelpers: HelpersContext
  , nodeId: string
  ) => {
    const nodecache = cache.nodecache
    const nc = nodecache [ nodeId ]
    const init = nc.exports.init
    const nodesById = graph.nodesById
    const node = nodesById [ nodeId ]

    let subctx: Context = context
    if ( init ) {
      const helpers = Object.assign ( {}, ohelpers )
      if ( !nc.cache ) {
        // cache passed in init call
        nc.cache = {}
        nc.control = ControlHelper.make ( nc )
      }
      helpers.cache = nc.cache
      helpers.context = context
      helpers.control = nc.control
      let children: any = []
      if ( node.all ) {
        const list = node.all.map ( ( childId ) => {
          return nodecache [ childId ].exports.update
        })
        children.all = () => {
          for ( const f of list ) {
            f ()
          }
        }

      }
      else if ( node.childrenm ) {
        children = node.childrenm.map ( ( childId ) => {
          return nodecache [ childId ].exports.update
        })
      }

      helpers.children = children

      nc.controls = []
      nc.helpers = helpers

      if ( cache.scrub === node.blockId ) {
        wscrub.init = () => {
          init ( helpers )
        }
      }

      try {
        const r = init ( helpers )
        if ( r ) {
          if ( typeof r !== 'object' ) {
            console.log ( `Init return value must be an object` )
          }
          else {
            subctx = context.set ( r )
          }
        }
      }
      catch ( err ) {
        // TODO: capture missing required assets and libraries
        // and do proper error handling for init code.
        console.log ( 'init error:', err )
        // abort init operation
        return
      }
    }
    else if ( nc.cache ) {
      // No init function = clear cached context and init cache
      delete nc.cache
      delete nc.helpers
    }

    const block = graph.blocksById [ node.blockId ]
    // Trigger init in children with sub context
    for ( const childId of node.children ) {
      if ( childId ) {
        initDo
        ( cache
        , graph
        , subctx
        , ohelpers
        , childId
        )
      }
    }
  }

  export const detachCheck =
  ( graph : GraphType
  , cache: PlaybackCache
  , context: Object // extra elements for update context
  , helpers: HelpersContext
  ) => {
    // 1. detach if needed
    if ( cache.graph && cache.graph !== graph ) {
      const h = Object.assign ( {}, helpers, { detached: true, children: [] })
      detach
      ( cache
      , cache.graph
      , graph
      , h
      , rootNodeId
      , false
     )
    }
  }

  export const compile =
  ( graph : GraphType
  , cache: PlaybackCache
  ) => {
    const output : string[] = []

    if ( !cache.nodecache ) {
      cache.nodecache = {}
    }

    // make sure to update functions for valid nodes if their source file changed.
    updateCache ( graph, cache )

    // save current graph to compare on detach.
    cache.graph = graph
  }

  export const init =
  ( graph : GraphType
  , context: Object // extra elements for update context
  , cache: PlaybackCache
  , helpers: HelpersContext
  ) => {
    const c = mainContext ( context )
    const h = Object.assign ( {}, helpers )
    initDo ( cache, graph, c, h, rootNodeId )
  }

  export const run =
  ( graph : GraphType
  , context: Object = {} // extra elements for update context
  , cache: PlaybackCache = { nodecache: {} }
  , helpers: HelpersContext = {}
  ) => {
    if ( cache.graph === graph && !cache.scrub ) {
      // nothing to recompile, update
      return
    }
    // 1. detach if needed
    detachCheck ( graph, cache, context, helpers )
    // 2. compile
    compile ( graph, cache )
    // 3. init
    init ( graph, context, cache, helpers )
    // 4. run
    const root = graph.nodesById [ rootNodeId ]
    if ( !root.invalid ) {
      const main = cache.nodecache [ rootNodeId ].exports.update
      if ( main ) {
        cache.main = main
        main ( context )
      }
    }
    else {
      cache.main = null
    }
  }

  class Context {
    constructor ( b: Object, n: Object ) {
      Object.assign ( this, b, n )
      Object.freeze ( this )
    }

    set ( n: Object ) {
      return new Context ( this, n )
    }
  }

  export const context =
  ( base: Object ) => {
    return <any> new Context ( {}, base )
  }

  export const mainContext =
  ( extra: Object = {} ) => {
    return <any> new Context ( { midi }, extra )
  }

  // context type
  export const mainContextProvide = context ( MAIN_CONTEXT )

  export const defaultMeta = Object.freeze
  ( { provide: Object.freeze ( {} )
    , expect: Object.freeze ( {} )
    }
  )
}
