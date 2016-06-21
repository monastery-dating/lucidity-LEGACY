import { BlockByIdType } from '../../Block'
import { Scrubber } from '../../Code/helper/CodeHelper'
import { GraphType, rootNodeId } from '../../Graph'
import { MidiHelper } from '../../Midi'
import { Block, Helpers, Control } from 'lucidity'
import { ControlHelper , PlaybackControl } from './ControlHelper'
import { SCRUBBER_VAR } from '../../Code'

const midi = MidiHelper.midiState ()

// This is the context defined before calling main.
export const MAIN_CONTEXT =
// midiState contains values for current ctrl and notes
{ midi: 'lucidity.Midi' // FIXME: this should be in a separate object. midi.State for
// example
}


const DUMMY_UPDATE = () => {}

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

interface SourceCallback {
  callback?: ( content: string ) => void
  source?: string
}

interface SourceCallbacks {
  [ key: string ]: SourceCallback
}

export interface NodeCache {
  // Functions defined by js code
  exported: NodeExports
  // Cache used in 'init' calls. Only exists if there is an
  // init function (removed if init is removed).
  cache?: Object
  // to check function cache.
  js: string
  // Live value update link
  scrubber?: Scrubber
  // We save the init context so that we can use it when detaching
  helpers?: Helpers

  sourceCallbacks?: SourceCallbacks

  // TODO: Remove these ? I don't want sliders and dummy controls. People should
  // use OSC, etc. We have scrubbing. It's better, no ?
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
  // Holds the communication between the editor and playback.
  scrubber?: Scrubber

  main?: UpdateFunc
  // Current graph. We use this to diff and detect
  // nodes to detach.
  graph?: GraphType
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
      n.exported = { update: DUMMY_UPDATE }
      continue
    }

    if ( !n ) {
      n = nodecache [ nodeId ] = <NodeCache> { exported: {} }
      n.scrubber = { values: [], literals: [], js: null }
    }

    let js = block.js
    let changed = n.js !== js

    if ( node.blockId === scrub && block.scrub ) {
      // Use special 'scrubbing' js.
      js = block.scrub.js
      if ( changed ) {
        // Update scrubber
        n.scrubber.values = [ ...block.scrub.values ]
        n.scrubber.literals = block.scrub.literals
      }
      Object.assign ( cache.scrubber, n.scrubber )
    }

    if ( changed ) {
      // clear
      n.exported = {}

      const exported = n.exported
      try {
        const codefunc = new Function ( 'exports', SCRUBBER_VAR, js )
        // We now run the code. The exports is the cache.
        const scrub = n.scrubber ? n.scrubber.values : null
        codefunc ( exported, scrub )
        n.js = js
      }
      catch ( err ) {
        // TODO: Proper error handling. These errors should not
        // happen that much since we do all the type checking.
        console.log ( `${block.name} error: ${ err }`)
      }
      if ( block.meta.update && !exported.update ) {
        exported.update = () => { console.log ( `${block.name} error: has update type '${block.meta.update}' but no update function.`) }
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
    const init = nc.exported.init
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

// Returns a new graph if init running alters a block (by declaring new assets
// for example).
const initDo =
( cache: PlaybackCache
, graph: GraphType
, context: Context
, ohelpers: HelpersContext
, nodeId: string
): GraphType => {
  let g = graph
  const nodecache = cache.nodecache
  const nc = nodecache [ nodeId ]
  const init = nc.exported.init
  const nodesById = g.nodesById
  const node = nodesById [ nodeId ]
  const block = g.blocksById [ node.blockId ]

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
        return nodecache [ childId ].exported.update
      })
      children.all = () => {
        for ( const f of list ) {
          f ()
        }
      }

    }
    else if ( node.childrenm ) {
      children = node.childrenm.map ( ( childId ) => {
        return nodecache [ childId ].exported.update
      })
    }

    helpers.children = children

    nc.controls = []
    nc.helpers = helpers

    if ( cache.scrub === node.blockId ) {
      cache.scrubber.init = () => {
        init ( helpers )
      }
    }

    // FIXME: optimize by only creating these handlers once
    const sources = block.sources || {}
    const nsources = {}
    if ( !nc.sourceCallbacks ) {
      nc.sourceCallbacks = {}
    }
    helpers.asset = {
      source ( name, callback ) {
        const content = sources [ name ]
        if ( content ) {
          nsources [ name ] = content
        }
        else {
          // Add new source
          nsources [ name ] = ''
        }
        let sclb = nc.sourceCallbacks [ name ]
        if ( !sclb ) {
          sclb = nc.sourceCallbacks [ name ] = {}
        }
        sclb.callback = callback
        if ( content !== sclb.source ) {
          callback ( content )
          sclb.source = content
        }
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
      return g
    }

    const nsk = Object.keys ( nsources )
    if ( nsk.length > 0 || block.sources ) {
      // Check if something changed
      let srcchanged = !block.sources || nsk.length === 0
      for ( const k of nsk ) {
        if ( srcchanged || sources [ k ] !== nsources [ k ] ) {
          srcchanged = true
          break
        }
      }
      if ( srcchanged ) {
        // block changed, we need to update graph
        if ( Object.isFrozen ( g ) ) {
          const blocksById = Object.assign ( {}, g.blocksById )
          g = { nodesById: g.nodesById, blocksById }
        }
        let sources
        if ( nsk.length > 0 ) {
          sources = nsources
        }
        g.blocksById [ node.blockId ] =
        Object.freeze ( Object.assign ( {}, block, { sources } ) )
      }
    }
  }
  else {
    // No init function = clear cached context and init cache
    delete nc.cache
    delete nc.helpers
    delete nc.sourceCallbacks
    if ( block.sources ) {
      // block changed, we need to update graph
      if ( Object.isFrozen ( g ) ) {
        const blocksById = Object.assign ( {}, g.blocksById )
        g = { nodesById: g.nodesById, blocksById }
      }
      g.blocksById [ node.blockId ] =
      Object.freeze ( Object.assign ( {}, block, { sources: undefined } ) )
    }
  }

  // Trigger init in children with sub context
  for ( const childId of node.children ) {
    if ( childId ) {
      g = initDo
      ( cache
      , g
      , subctx
      , ohelpers
      , childId
      )
    }
  }
  return g
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

export const compileGraph =
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

  const root = graph.nodesById [ rootNodeId ]
  if ( !root.invalid ) {
    const main = cache.nodecache [ rootNodeId ].exported.update
    cache.main = main
  }
  else {
    cache.main = null
  }
}

// If the graph needs to be updated on init run (like adding new sources to
// block), initGraph returns the new graph.
export const initGraph =
( graph : GraphType
, context: Object // extra elements for update context
, cache: PlaybackCache
, helpers: HelpersContext
): GraphType => {
  const c = mainContext ( context )
  const h = Object.assign ( {}, helpers )
  let g = initDo ( cache, graph, c, h, rootNodeId )
  if ( !Object.isFrozen ( g ) ) {
    // changed
    g.blocksById = Object.freeze ( g.blocksById )
    return Object.freeze ( g )
  }
  return graph
}

// If the graph needs to be updated on init run (like adding new sources to
// block), the runGraph returns the new graph.
export const runGraph =
( graph : GraphType
, context: Object = {} // extra elements for update context
, cache: PlaybackCache = { nodecache: {} }
, helpers: HelpersContext = {}
): GraphType => {
  if ( !cache.scrub ) {
    if ( cache.graph && cache.graph.blocksById === graph.blocksById ) {
      // Avoir compilation if blocks did not change ( which they do if we do
      // any kind of operation: move is remove block / add block, etc.)
      return
    }
  }
  // 1. detach if needed
  detachCheck ( graph, cache, context, helpers )
  // 2. compile
  compileGraph ( graph, cache )
  // 3. init
  // FIXME: Can we improve and only call init on top most changed elements ?
  let g = initGraph ( graph, context, cache, helpers )
  // 4. run
  callGraph ( cache, context )

  return g
}

export const callGraph =
( cache: PlaybackCache = { nodecache: {} }
, context: Object = {} // extra elements for update context
) => {
  const main = cache.main
  if ( main ) {
    main ( context )
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

export const makeContext =
( base: Object ) => {
  return <any> new Context ( {}, base )
}

export const mainContext =
( extra: Object = {} ) => {
  return <any> new Context ( { midi }, extra )
}

// context type
export const mainContextProvide = makeContext ( MAIN_CONTEXT )

export const defaultMeta = Object.freeze
( { provide: Object.freeze ( {} )
  , expect: Object.freeze ( {} )
  }
)
