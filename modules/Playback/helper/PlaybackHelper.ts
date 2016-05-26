import { BlockByIdType } from '../../Block'
import { GraphType, NodeHelper } from '../../Graph'

const rootNodeId = NodeHelper.rootNodeId

const DUMMY =
{ 'text:string': 'dummy.emptyText'
}

const mainRender =
( ctx: RenderContext
, child: RenderFunc
) => {
  if ( child ) {
    child ( ctx )
  }
}

const mainCache =
(): NodeCache => {
  return { js: ''
         , render: mainRender
         , curry: null
         }
}

export interface PlaybackRender {
  (): void
}

interface RenderContext {
  // camera, time...
  [ key: string ]: any
}

interface RenderFunc {
  ( ctx: RenderContext, ...any ): any
}

interface CurryFunc {
  ( ctx: RenderContext ): any
}

interface NodeCache {
  // Function defined by js code
  render: RenderFunc
  // Closure used by sub-nodes to call the render func.
  // The closure contains the extra sub-nodes function params.
  curry: CurryFunc
  js: string // to check cache
}

interface PlaybackNodeCache {
  [ key: string ]: NodeCache
}

export interface PlaybackCache {
  nodecache: PlaybackNodeCache
  main?: RenderFunc
  oldgraph?: GraphType
}

export module PlaybackHelper {

  const clearCurry =
  ( cache: PlaybackNodeCache ) => {
    for ( const k in cache ) {
      delete cache [ k ].curry
    }
  }

  const updateRender =
  ( graph: GraphType
  , blocksById: BlockByIdType
  , cache: PlaybackNodeCache
  ): boolean => {
    let shouldClear = false

    for ( const nodeId of graph.nodes ) {

      const node = graph.nodesById [ nodeId ]
      if ( !node ) {
        throw ( `Error in graph: missing '${nodeId}'.`)
      }
      const block = blocksById [ node.blockId ]

      // main
      let n = cache [ nodeId ]

      if ( nodeId == rootNodeId ) {
        if ( !n ) {
          cache [ nodeId ] = mainCache ()
        }
        continue
      }

      if ( !n || n.js !== block.js ) {
        // clear curry cache
        shouldClear = true

        if ( !n ) {
          n = cache [ nodeId ] = <NodeCache> {}
        }
        else {
          // clear
          n.render = null
        }
        try {
          const codefunc = new Function ( 'exports', block.js )
          // We now run the code. The exports is the cache.
          codefunc ( n )
          n.js = block.js
        }
        catch ( err ) {
          // TODO: proper error handling
          console.log ( `${block.name} error: ${ err }`)

        }
        if ( !n.render ) {
          n.render = () => { console.log ( `${block.name} error`)}
        }
      }

    }
    
    // Now every node has a render function
    return shouldClear
  }

  const updateCurry =
  ( graph: GraphType
  , cache: PlaybackNodeCache
  , key: string
  ): RenderFunc => {
    const nc = cache [ key ]
    if ( !nc ) {
      console.log ( graph, cache )
      throw `Corrupt graph. Child '${key}' not in 'nodes'.`
    }
    if ( nc.curry ) {
      return nc.curry
    }

    const render = nc.render

    const e = graph.nodesById [ key ]
    if ( !e ) {
      // corrupt graph
      console.log ( `Invalid child ${key} in graph (node not found).`)
      return () => {}
    }

    // Depth-first processing.
    const args = []
    for ( const child of e.children ) {
      if ( child === null ) {
        // FIXME: use a dummy input
        args.push ( () => ({}) )
      }
      else {
        const f = updateCurry ( graph, cache, child )
        args.push ( f )
      }
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
  , blocksById: BlockByIdType
  , cache: PlaybackCache
  ) : RenderFunc => {
    const output : string[] = []
    // update render functions for each node
    const shouldClear = updateRender
    ( graph, blocksById, cache.nodecache )

    if ( shouldClear || graph !== cache.oldgraph ) {
      // One of the files has changed or the graph has changed:
      // we need to rebuild all curry functions.
      clearCurry ( cache.nodecache )
      cache.main = updateCurry ( graph, cache.nodecache, rootNodeId )
      cache.oldgraph = graph
    }
    return cache.main
  }

}
