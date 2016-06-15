import { BlockByIdType } from '../../Block'
import { GraphType, NodeHelper } from '../../Graph'
import { MidiHelper } from '../../Midi'
import { Block, Helpers, Control } from '../types/lucidity'
import { ControlHelper , PlaybackControl } from './ControlHelper'

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
  // to check cache
  js: string
  // We save the init context so that we can use it when detaching
  ctx?: RenderContext
  control?: Control
  controls?: PlaybackControl[]
}

interface PlaybackNodeCache {
  [ key: string ]: NodeCache
}

export interface PlaybackCache {
  nodecache: PlaybackNodeCache
  main?: UpdateFunc
  // Current graph. We use this to diff and detect
  // nodes to detach.
  graph?: GraphType
}

const DUMMY_INPUT = () => null

export module PlaybackHelper {

  const updateCache =
  ( graph: GraphType
  , cache: PlaybackNodeCache
  ) => {

    for ( const nodeId in graph.nodesById ) {

      const node = graph.nodesById [ nodeId ]
      if ( !node ) {
        throw ( `Error in graph: missing '${nodeId}'.`)
      }
      const block = graph.blocksById [ node.blockId ]

      let n = cache [ nodeId ]

      if ( node.invalid ) {
        // ignore
        continue
      }

      if ( !n || n.js !== block.js ) {
        if ( !n ) {
          n = cache [ nodeId ] = <NodeCache> { exports: {} }
        }
        else {
          // clear
          n.exports = {}
        }

        const exports = n.exports
        try {
          const codefunc = new Function ( 'exports', block.js )
          // We now run the code. The exports is the cache.
          codefunc ( exports )
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
        helpers.cache = nc.cache
        helpers.context = nc.ctx
        helpers.control = nc.control
        // clear previous controls
        nc.controls = []
        try {
          init ( helpers )
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
  ( cache: PlaybackNodeCache
  , graph: GraphType
  , context: Context
  , helpers: HelpersContext
  , nodeId: string
  ) => {
    const nc = cache [ nodeId ]
    const init = nc.exports.init
    const nodesById = graph.nodesById
    const node = nodesById [ nodeId ]

    let subctx: Context = context
    if ( init ) {
      if ( !nc.cache ) {
        // cache passed in init call
        nc.cache = {}
        nc.control = ControlHelper.make ( nc )
      }
      nc.ctx = context
      helpers.cache = nc.cache
      helpers.context = nc.ctx
      helpers.control = nc.control
      let children: any = []
      if ( node.all ) {
        const list = node.all.map ( ( childId ) => {
          return cache [ childId ].exports.update
        })
        children.all = () => {
          for ( const f of list ) {
            f ()
          }
        }

      }
      else if ( node.childrenm ) {
        children = node.childrenm.map ( ( childId ) => {
          return cache [ childId ].exports.update
        })
      }

      helpers.children = children

      nc.controls = []
      
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
      delete nc.ctx
    }

    const block = graph.blocksById [ node.blockId ]
    // Trigger init in children with sub context
    for ( const childId of node.children ) {
      if ( childId ) {
        initDo
        ( cache
        , graph
        , subctx
        , helpers
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
    updateCache ( graph, cache.nodecache )

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
    initDo ( cache.nodecache, graph, c, h, rootNodeId )
  }

  export const run =
  ( graph : GraphType
  , context: Object = {} // extra elements for update context
  , cache: PlaybackCache = { nodecache: {} }
  , helpers: HelpersContext = {}
  ) => {
    if ( cache.graph === graph ) {
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
