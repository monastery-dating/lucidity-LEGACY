import { describe } from '../../Test'
import { GraphType } from '../../Graph'
import { GraphHelper } from '../../Graph/helper/GraphHelper'
import { PlaybackHelper } from './PlaybackHelper'
import { PlaybackControl } from './ControlHelper'
import * as ts from 'typescript'

declare var require: any
const GRAPH = require ( './test/graph.json.txt' )
/** GRAPH structure
[ main        ]
[ join        ]
[ a     ] [ b ] 'b' ==> calls child with an empty slot
[ cache ]       ==> calls init
*/

describe ( 'PlaybackHelper.compile', ( it ) => {
  /* TODO: create graph here, eventually with
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
  PlaybackHelper.compile ( graph, cache )
  // node cache
  const nca: any = {}
  for ( const k in graph.nodesById ) {
    const node = graph.nodesById [ k ]
    const block = graph.blocksById [ node.blockId ]
    nca [ block.name ] = cache.nodecache [ k ]
  }

  it ( 'should run init', ( assert ) => {
    PlaybackHelper.init ( graph, cache, {}, { require } )
    assert.equal ( nca.cache.cache, { foo: 1 } )
  })

  it ( 'should reuse cache in init', ( assert ) => {
    PlaybackHelper.init ( graph, cache, {}, { require } )
    PlaybackHelper.init ( graph, cache, {}, { require } )
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
  */
  it ( 'should be fixed', ( assert ) => {
    assert.pending ( 'build graph from yaml to fix compile tests' )
  })
})

describe ( 'PlaybackHelper.context', ( it ) => {
  const context = PlaybackHelper.context ( { foo: 'bar' } )

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

describe ( 'PlaybackHelper.controls Slider ', ( it ) => {
  const graph = GraphHelper.create
  ( 'main'
  , `export const init =
     ( { context, control } ) => {
       control.Slider ( 'foo', ( v ) => {
         context.test.v = v
       })
     }`
  )
  const cache = { nodecache: {} }
  const context: any = { test: {} }
  PlaybackHelper.run ( graph, context, cache )
  const nc = cache.nodecache [ 'n0' ]

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

describe ( 'PlaybackHelper.controls Pad', ( it ) => {
  const graph = GraphHelper.create
  ( 'main'
  , `export const init =
     ( { context, control } ) => {
       control.Pad ( 'foo', 'bar', ( x, y ) => {
         context.test.x = x
         context.test.y = y
       })
     }`
  )
  const cache = { nodecache: {} }
  const context: any = { test: {} }
  PlaybackHelper.run ( graph, context, cache )
  const nc = cache.nodecache [ 'n0' ]

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

describe ( 'PlaybackHelper.controls many', ( it ) => {
  const graph = GraphHelper.create
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
  const cache = { nodecache: {} }
  const context: any = { test: {} }
  PlaybackHelper.run ( graph, context, cache )
  // simulate change
  const graph2: GraphType = { nodesById: graph.nodesById, blocksById: graph.blocksById }
  PlaybackHelper.run ( graph2, context, cache )
  const nc = cache.nodecache [ 'n0' ]

  it ( 'should extract many controls', ( assert ) => {
    const ctrl: PlaybackControl = nc.controls [ 0 ]
    assert.equal ( 3, nc.controls.length )
    assert.equal
    ( [ [ 'a' ], [ 'b' ], [ 'foo', 'bar' ] ]
    , nc.controls.map ( ( c ) => c.labels )
    )
  })

})

describe ( 'PlaybackHelper.scrubParse', ( it ) => {
  const js = ts.transpile
  ( `export const init =
     ( { context } ) => {
       context.test.a = 10
       context.test.b = 20
       context.test.x = 30
       context.test.y = 40
     }

     export const update =
     () => {
       return 10
     }
    `
  )
  const literals = []
  const scrubjs = PlaybackHelper.scrubParse
  ( js, literals )
  console.log ( scrubjs )

  it ( 'should transform source', ( assert ) => {
    assert.equal
    ( literals
    , [10,20,30,40,10]
    )
  })

})

/*
describe ( 'PlaybackHelper.compile scrub', ( it ) => {
  const graph = GraphHelper.create
  ( 'main'
  , `export const init =
     ( { context } ) => {
       context.test.a = 10
       context.test.b = 20
       context.test.x = 30
       context.test.y = 40
     }

     export const update =
     () => {
       return 10
     }
    `
  )
  const cache = { nodecache: {}, scrub: 'b0' }
  const context: any = { test: {} }
  PlaybackHelper.run ( graph, context, cache )
  // the js source for this node is now a special parsing with the scrubber '$l$' instead of the values.
  // simulate change
  const graph2: GraphType = { nodesById: graph.nodesById, blocksById: graph.blocksById }
  PlaybackHelper.run ( graph2, context, cache )
  const nc = cache.nodecache [ 'n0' ]

  it ( 'should extract many controls', ( assert ) => {
    const ctrl: PlaybackControl = nc.controls [ 0 ]
    assert.equal ( 3, nc.controls.length )
    assert.equal
    ( [ [ 'a' ], [ 'b' ], [ 'foo', 'bar' ] ]
    , nc.controls.map ( ( c ) => c.labels )
    )
  })

})
*/
