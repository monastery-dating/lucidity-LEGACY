import { BlockByIdType } from '../../Block'
import { GraphType, NodeHelper } from '../../Graph'

// This is the context defined before calling main.
export const MAIN_CONTEXT =
{
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

interface InitContext {
  cache?: any
  require: any
}

interface InitFunc {
  ( ctx: InitContext ): void
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
  // We save the init return value here (indicates when to run
  // init).
  initOpts: null
}

interface PlaybackNodeCache {
  [ key: string ]: NodeCache
}

export interface PlaybackCache {
  nodecache?: PlaybackNodeCache
  main?: RenderFunc
  // Ids of nodes with an init function (in depth-first order).
  init?: string[]
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

    // depth-first
    if ( nc.exports.init ) {
      cache.init.push ( key )
      if ( !nc.cache ) {
        // cache passed in init call
        nc.cache = {}
      }
    }
    else {
      // clear init cache
      nc.cache = {}
    }

    // Create the curry function
    const curry = ( ctx: RenderContext ) => {
      return render ( ctx, ...args )
    }
    nc.curry = curry

    return curry
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

    // Clear init functions
    cache.init = []

    clearCurry ( cache.nodecache )
    cache.main = updateCurry ( graph, cache, rootNodeId )
  }

  export const init =
  ( cache: PlaybackCache
  , context: InitContext
  // 'scenes', 'resize' and other special operations. Optional
  // init calls have to be asked for through init return value.
  , op?: string
  ) => {
    // call in reverse depth-first order
    // (call parent before child)
    const init = cache.init
    const ncache = cache.nodecache
    const c: InitContext = Object.assign ( {}, context )
    for ( let i = init.length - 1; i >= 0; --i ) {
      const node = ncache [ init [ i ] ]
      const f = node.exports.init
      if ( !op || ( node.initOpts && node.initOpts [ op ] ) ) {
        try {
          c.cache = node.cache
          // call init
          const opts = f ( c )

          if ( opts && typeof opts !== 'object' ) {
            // TODO: ERROR handling
            console.log ( `Init return value must be an object` )
          }
          else {
            // save init options
            node.initOpts = opts
          }
        }
        catch ( err ) {
          // TODO: capture missing required assets and libraries
          // and do proper error handling for init code.
          console.log ( err )
        }
      }
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

  export const mainContext = context ( MAIN_CONTEXT )

  export const defaultMeta = Object.freeze
  ( { provide: Object.freeze ( {} )
    , expect: Object.freeze ( {} )
    }
  )
}
