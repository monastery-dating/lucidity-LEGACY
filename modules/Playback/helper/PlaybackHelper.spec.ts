import { describe } from '../../Test'
import { GraphType } from '../../Graph'
import { PlaybackHelper } from './PlaybackHelper'

declare var require: any
const GRAPH = require ( './test/graph.json.txt' )
/** GRAPH structure
[ main        ]
[ join        ]
[ a     ] [ b ] 'b' ==> calls child with an empty slot
[ cache ]       ==> calls init
*/

describe ( 'PlaybackHelper.compile', ( it ) => {
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
    PlaybackHelper.init ( cache, { require } )
    assert.equal ( nca.cache.cache, { foo: 1 } )
  })

  it ( 'should reuse cache in init', ( assert ) => {
    PlaybackHelper.init ( cache, { require } )
    PlaybackHelper.init ( cache, { require } )
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
