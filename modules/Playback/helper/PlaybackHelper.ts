import { BlockByIdType } from '../../Block'
import { GraphType, NodeHelper } from '../../Graph'
import { MidiHelper } from '../../Midi'

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

interface HelpersContext {
  cache?: any
  require: any
  detached?: boolean
}

interface InitFunc {
  ( ctx: RenderContext, helpers: HelpersContext ): Object
}

interface RenderFunc {
  ( ctx: RenderContext, ...any ): any
}

interface CurryFunc {
  ( ctx: RenderContext ): any
}

interface NodeExports {
  render?: RenderFunc
  init?: InitFunc
}

interface NodeCache {
  // Functions defined by js code
  exports: NodeExports
  // Cached values from 'init' calls. Only exists if there is an
  // init function (removed if init is removed).
  cache?: Object
  // Closure used by sub-nodes to call the render func.
  // The closure contains the extra sub-nodes function params.
  curry: CurryFunc
  // to check cache
  js: string
  // We save the init context so that we can use it when detaching
  ctx?: RenderContext
}

interface PlaybackNodeCache {
  [ key: string ]: NodeCache
}

export interface PlaybackCache {
  nodecache?: PlaybackNodeCache
  main?: RenderFunc
  // Ids of nodes with an init function (in depth-first order).
  init?: string[]
  // Current graph. We use this to diff and detect
  // nodes to detach.
  graph?: GraphType
}

const DUMMY_INPUT = () => null

export module PlaybackHelper {

  const clearCurry =
  ( cache: PlaybackNodeCache ) => {
    for ( const k in cache ) {
      delete cache [ k ].curry
    }
  }

  const updateRender =
  ( graph: GraphType
  , cache: PlaybackNodeCache
  ): boolean => {
    let shouldClear = false

    for ( const nodeId in graph.nodesById ) {

      const node = graph.nodesById [ nodeId ]
      if ( !node ) {
        throw ( `Error in graph: missing '${nodeId}'.`)
      }
      const block = graph.blocksById [ node.blockId ]

      // main
      let n = cache [ nodeId ]

      if ( !n || n.js !== block.js ) {
        // clear curry cache
        shouldClear = true

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
        if ( !exports.render ) {
          exports.render = () => { console.log ( `${block.name} error`)}
        }
      }
    }

    // Now every node has a render function
    return shouldClear
  }

  const updateCurry =
  ( graph: GraphType
  , cache: PlaybackCache
  , key: string
  ): RenderFunc => {
    const nc = cache.nodecache [ key ]
    const node = graph.nodesById [ key ]
    if ( !nc ) {
      console.log ( graph, cache )
      throw `Corrupt graph. Child '${key}' not in 'nodesById'.`
    }
    if ( nc.curry ) {
      return nc.curry
    }

    const render = node.invalid ? DUMMY_INPUT : nc.exports.render

    const e = graph.nodesById [ key ]
    if ( !e ) {
      // corrupt graph
      console.log ( `Invalid child ${key} in graph (node not found).`)
      return () => {}
    }
    const b = graph.blocksById [ e.blockId ]

    // Depth-first processing.
    const args = []
    const len = Math.max ( e.children.length, b.input.length )
    for ( let i = 0; i < len; ++i ) {
      const child = e.children [ i ]
      if ( !child ) {
        // FIXME: use a dummy input
        args.push ( DUMMY_INPUT )
      }
      else {
        const f = updateCurry ( graph, cache, child )
        args.push ( f )
      }
    }

    // Create the curry function
    // no arguments from caller
    const curry = () => {
      return render ( nc.ctx, ...args )
    }
    nc.curry = curry

    return curry
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
        try {
          init ( nc.ctx, helpers )
        }
        catch (err) {
          // FIXME: proper error handling
          console.log ( 'detach error:', err )
        }
        // clear cache
        nc.cache = {}
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

    let subctx: Context = context
    if ( init ) {
      if ( !nc.cache ) {
        // cache passed in init call
        nc.cache = {}
      }
      try {
        helpers.cache = nc.cache
        let r = init ( context, helpers )
        if ( r ) {
          if ( typeof r !== 'object' ) {
            console.log ( `Init return value must be an object` )
          }
          else {
            subctx = context.set ( r )
            console.log ( subctx )
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
      nc.ctx = context
    }
    else if ( nc.cache ) {
      // No init function = clear cached context and init cache
      delete nc.cache
      delete nc.ctx
    }

    // Trigger init in children with sub context
    const node = graph.nodesById [ nodeId ]
    for ( const childId of node.children ) {
      initDo
      ( cache
      , graph
      , subctx
      , helpers
      , childId
      )
    }
  }

  export const detachCheck =
  ( graph : GraphType
  , cache: PlaybackCache
  , context: Object // extra elements for render context
  , helpers: HelpersContext
  ) => {
    // 1. detach if needed
    if ( cache.graph && cache.graph !== graph ) {
      const h = Object.assign ( {}, helpers, { detached: true })
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

    // update render functions for each node
    const shouldClear = updateRender
    ( graph, cache.nodecache )

    // TODO: we could probably find a way to not rebuild the
    // full graph but we might not gain any performance.

    // Rebuild all curry functions.


    clearCurry ( cache.nodecache )
    cache.main = updateCurry ( graph, cache, rootNodeId )

    // save current graph to compare on detach.
    cache.graph = graph
  }

  export const init =
  ( graph : GraphType
  , cache: PlaybackCache
  , context: Object // extra elements for render context
  , helpers: HelpersContext
  ) => {
    const c = mainContext ( context )
    const h = Object.assign ( {}, helpers )
    initDo ( cache.nodecache, graph, c, h, rootNodeId )
  }

  export const run =
  ( graph : GraphType
  , cache: PlaybackCache
  , context: Object = {} // extra elements for render context
  , helpers: HelpersContext
  ) => {
    // 1. detach if needed
    detachCheck ( graph, cache, context, helpers )
    // 2. compile
    compile ( graph, cache )
    // 3. init
    init ( graph, cache, context, helpers )
    // 4. run
    cache.main ( context )
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
