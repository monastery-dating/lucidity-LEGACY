import { describe } from '../../Test'
import { GraphType } from '../../Graph'
import { createGraph } from '../../Graph/helper/GraphHelper'
import { compileGraph, makeContext, runGraph, NodeCache } from './PlaybackHelper'
import { PlaybackControl } from './ControlHelper'

declare var require: any
const GRAPH = require ( './test/graph.json.txt' )
/** GRAPH structure
[ main        ]
[ join        ]
[ a     ] [ b ] 'b' ==> calls child with an empty slot
[ cache ]       ==> calls init
*/

const SOURCE_EXTRA = `
export const init =
( { context, asset } ) => {
  asset.source ( 'frag.glsl', ( s ) => {
    context.test.frag = s
  })
  asset.source ( 'vert.glsl', ( s ) => {
    context.test.vert = s
  })
}
`

/* TODO: create graph here, eventually with
describe ( 'compileGraph', ( it ) => {
  const graph = GraphHelper.fromYAML
  ( `name: foo
     source: |
       this is the
       source of this
       thing.
     children:
       - name: child1
         source: ...
       - name: child2
         source: ...
    `
  )
  /*
  let counter = 0
  // simulate preloaded libraries
  const PRELOADED = { counter () { return ++counter } }
  // mock playback require for now
  const require = ( name ) => {
    return PRELOADED [ name ]
  }

  const graph: GraphType = JSON.parse ( GRAPH )
  const cache: any = {}
  compileGraph ( graph, cache )
  // node cache
  const nca: any = {}
  for ( const k in graph.nodesById ) {
    const node = graph.nodesById [ k ]
    const block = graph.blocksById [ node.blockId ]
    nca [ block.name ] = cache.nodecache [ k ]
  }

  it ( 'should run init', ( assert ) => {
    initGraph ( graph, cache, {}, { require } )
    assert.equal ( nca.cache.cache, { foo: 1 } )
  })

  it ( 'should reuse cache in init', ( assert ) => {
    initGraph ( graph, cache, {}, { require } )
    initGraph ( graph, cache, {}, { require } )
    assert.equal ( nca.cache.cache, { foo: 1 } )
    assert.equal ( 1, counter )
  })

  it ( 'should compile graph into a function', ( assert ) => {
    assert.equal ( 'function' , typeof cache.main )
  })

  it ( 'should run main', ( assert ) => {
    const res = cache.main ()
    assert.equal ( '1bnull', res )
  })
})
*/

describe ( 'context', ( it ) => {
  const context = makeContext ( { foo: 'bar' } )

  it ( 'should be immutable', ( assert ) => {
    assert.throws ( () => { context.foo = 'baz' } )
  })

  it ( 'should create new object on set', ( assert ) => {
    const c = context.set ( { camera: 'hello' } )
    assert.notSame ( c, context )
    assert.equal
    ( { camera: 'hello', foo: 'bar' }
    , c
    )
  })

})

describe ( 'PlaybackHelper.controls Slider ', ( it, setupDone ) => {
  let graph: GraphType
  const cache = { nodecache: {} }
  const context: any = { test: {} }
  let nc: NodeCache

  createGraph
  ( 'main'
  , `export const init =
     ( { context, control } ) => {
       control.Slider ( 'foo', ( v ) => {
         context.test.v = v
       })
     }`
  )
  .then ( ( g ) => {
    graph = g

    runGraph ( graph, context, cache )
    nc = cache.nodecache [ 'n0' ]

    setupDone ()
  })
  .catch ( ( errors ) => {
    console.log ( `Errors in PlaybackHelper controls test setup.`, errors )
  })

  it ( 'should extract controls', ( assert ) => {
    const ctrl: PlaybackControl = nc.controls [ 0 ]
    assert.equal ( ctrl.type, 'Slider' )
    assert.equal ( ctrl.labels, [ 'foo' ] )
    assert.equal ( ctrl.values, [ 0 ] )
    assert.equal ( typeof ctrl.set, 'function' )
  })

  it ( 'set should call callback', ( assert ) => {
    const test = context.test
    test.v = 0
    const ctrl: PlaybackControl = nc.controls [ 0 ]
    ctrl.set ( [ 15 ] )
    assert.equal ( context.test.v, 15 )
    assert.equal ( ctrl.values, [ 15 ] )
  })

})

describe ( 'PlaybackHelper.controls Pad', ( it, setupDone ) => {
  let graph: GraphType
  const cache = { nodecache: {} }
  const context: any = { test: {} }
  let nc: NodeCache

  createGraph
  ( 'main'
  , `export const init =
     ( { context, control } ) => {
       control.Pad ( 'foo', 'bar', ( x, y ) => {
         context.test.x = x
         context.test.y = y
       })
     }`
  )
  .then ( ( g ) => {
    graph = g

    runGraph ( graph, context, cache )
    nc = cache.nodecache [ 'n0' ]

    setupDone ()
  })
  .catch ( ( errors ) => {
    console.log ( `Errors in PlaybackHelper controls Pad test setup.`, errors )
  })

  it ( 'should extract controls', ( assert ) => {
    const ctrl: PlaybackControl = nc.controls [ 0 ]
    assert.equal ( ctrl.type, 'Pad' )
    assert.equal ( ctrl.labels, [ 'foo', 'bar' ] )
    assert.equal ( ctrl.values, [ 0, 0 ] )
    assert.equal ( typeof ctrl.set, 'function' )
  })

  it ( 'set should call callback', ( assert ) => {
    const test = context.test
    test.x = 0
    test.y = 0
    const ctrl: PlaybackControl = nc.controls [ 0 ]
    ctrl.set ( [ 10, 20 ] )
    assert.equal ( context.test, { x: 10, y: 20 } )
    assert.equal ( ctrl.values, [ 10, 20 ] )
  })

})

describe ( 'PlaybackHelper.controls many', ( it, setupDone ) => {
  let graph: GraphType
  const cache = { nodecache: {} }
  const context: any = { test: {} }
  let nc: NodeCache
  createGraph
  ( 'main'
  , `export const init =
     ( { context, control } ) => {
       control.Slider ( 'a', ( v ) => {
         context.test.a = v
       })
       control.Slider ( 'b', ( v ) => {
         context.test.b = v
       })
       control.Pad ( 'foo', 'bar', ( x, y ) => {
         context.test.x = x
         context.test.y = y
       })
     }`
  )
  .then ( ( g ) => {
    graph = g
    runGraph ( graph, context, cache )
    nc = cache.nodecache [ 'n0' ]
    // simulate change
    const graph2: GraphType = { nodesById: graph.nodesById, blocksById: graph.blocksById }
    runGraph ( graph2, context, cache )
    nc = cache.nodecache [ 'n0' ]

    setupDone ()
  })
  .catch ( ( errors ) => {
    console.log ( `Errors in PlaybackHelper controls many test setup.`, errors )
  })

  it ( 'should extract many controls', ( assert ) => {
    const ctrl: PlaybackControl = nc.controls [ 0 ]
    assert.equal ( 3, nc.controls.length )
    assert.equal
    ( [ [ 'a' ], [ 'b' ], [ 'foo', 'bar' ] ]
    , nc.controls.map ( ( c ) => c.labels )
    )
  })

})

describe ( 'PlaybackHelper asset.source', ( it, setupDone ) => {
  let graph: GraphType
  let graph2: GraphType
  let graph3: GraphType
  const cache = { nodecache: {} }
  const context: any = { test: { frag: 'x', vert: 'x' } }
  let nc: NodeCache

  createGraph
  ( 'main'
  , SOURCE_EXTRA
  )
  .then ( ( g ) => {
    graph = runGraph ( g, context, cache )
    nc = cache.nodecache [ 'n0' ]
    graph2 = { nodesById: graph.nodesById, blocksById: graph.blocksById }
    graph3 = runGraph ( graph2, context, cache )

    nc = cache.nodecache [ 'n0' ]

    setupDone ()
  })

  it ( 'should not modify graph without changes', ( assert ) => {
    assert.same ( graph3, graph2 )
  })

  it ( 'should set extra sources', ( assert ) => {
    const block = graph.blocksById [ 'b0' ]
    assert.equal
    ( Object.keys ( block.sources ).sort ()
    , [ 'frag.glsl', 'vert.glsl' ]
    )

    assert.equal
    ( Object.keys ( nc.sourceCallbacks ).sort ()
    , [ 'frag.glsl', 'vert.glsl' ]
    )

    assert.equal ( '', context.test.frag )
    assert.equal ( '', context.test.vert )

    nc.sourceCallbacks [ 'frag.glsl' ].callback ( 'fragment' )
    assert.equal ( 'fragment', context.test.frag )
    assert.equal ( '', context.test.vert )
  })

})
