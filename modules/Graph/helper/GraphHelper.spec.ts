import { describe } from '../../Test/runner'
import { GraphType } from '../types'
import { GraphHelper } from './GraphHelper'
import { NodeHelper } from './NodeHelper'
import { BlockHelper } from '../../Block'

import { Immutable as IM } from './Immutable'

const rootNodeId = NodeHelper.rootNodeId
const rootBlockId = BlockHelper.rootBlockId
const SOURCE_A =
`export const render = ( ctx, child, child2 ) => {}
`
const SOURCE_foo =
`export const render = ( ctx, child, child2 ) => {}
export const meta =
{ expect: { bar: 'bar.type', baz: 'baz.type' }
}`

const traverse =
( graph: GraphType ) : string[] => {

  const res: string[] = []
  const op = ( nid, s = '' ) => {
    if ( nid ) {
      const node = graph.nodesById [ nid ]
      const block = graph.blocksById [ node.blockId ]
      res.push ( `${s}${nid}:${node.blockId}:${block.name}` )
      for ( const k of node.children ) {
        op ( k, s + ' ' )
      }
    }
    else {
      res.push ( `${s}${nid}` )
    }
  }

  op ( rootNodeId )
  return res
}

describe ( 'GraphHelper.create', ( it ) => {
  const graph = GraphHelper.create ()

  it ( 'create node for block', ( assert ) => {
    assert.equal
    ( graph.nodesById [ rootNodeId ]
    , { id: rootNodeId
      , blockId: rootBlockId
      , parent: null
      , children: []
      }
    )
  })

  it ( 'should select block', ( assert ) => {
    assert.equal ( graph.blockId, rootBlockId )
  })

  it ( 'should save block', ( assert ) => {
    assert.equal
    ( graph.blocksById [ rootBlockId ].name, 'main' )
    assert.equal
    ( graph.blocksById [ rootBlockId ].id, rootBlockId )
  })

  it ( 'should be immutable', ( assert ) => {
    assert.throws
    ( function () {
        graph.nodesById [ 'foo' ] =
        NodeHelper.create ( 'abc', 'idid', null )
      }
    )
  })

  it ( 'should set meta', ( assert ) => {
    const graph = GraphHelper.create ( 'foo', SOURCE_foo )
    assert.equal
    ( graph.blocksById [ rootBlockId ].meta
    , { provide: {}
      , expect: { bar: 'bar.type', baz: 'baz.type' }
      }
    )
  })

})

describe ( 'GraphHelper.append', ( it ) => {
    let graph = GraphHelper.create ()
    const graph2 = GraphHelper.create ( 'foo', SOURCE_A )
    graph = GraphHelper.append ( graph, rootNodeId, graph2 )

    it ( 'should append child in parent', ( assert ) => {
        assert.equal
        ( graph.nodesById [ rootNodeId ].children
        , [ 'n1' ]
        )
      }
    )

    it ( 'should select block', ( assert ) => {
        assert.equal
        ( graph.blockId
        , 'b1' // graph2 blockId
        )
      }
    )

    it ( 'should add block', ( assert ) => {
        assert.equal
        ( graph.blocksById [ 'b1' ].name
        , 'foo'
        )
      }
    )

    it ( 'add new node in nodesById', ( assert ) => {
        assert.equal
        ( graph.nodesById [ 'n1' ]
        , { id: 'n1'
          , blockId: 'b1'
          , parent: rootNodeId
          , children: []
          }
        )
      }
    )

  }
)

describe ( 'GraphHelper.insert', ( it ) => {
    let graph = GraphHelper.create ( 'main', SOURCE_A )
    const g1 = GraphHelper.create ( 'foo', SOURCE_A )
    const g2 = GraphHelper.create ( 'bar', SOURCE_A )
    graph = GraphHelper.insert ( graph, rootNodeId, 0, g1 )
    graph = GraphHelper.insert ( graph, rootNodeId, 0, g2 )

    it ( 'insert child in parent', ( assert ) => {

        assert.equal
        ( graph.nodesById [ rootNodeId ].children
        , [ 'n2', 'n1' ]
        )
      }
    )

    it ( 'should select block', ( assert ) => {
        assert.equal
        ( graph.blockId
        , 'b2' // g2 block id
        )
      }
    )


    it ( 'should insert null', ( assert ) => {
        let graph = GraphHelper.create ()
        graph = GraphHelper.insert ( graph, rootNodeId, 1, g1 )
        assert.equal
        ( graph.nodesById [ rootNodeId ].children
        , [ null, 'n1' ]
        )
      }
    )

    it ( 'should replace null', ( assert ) => {
        let graph = GraphHelper.create ()
        graph = GraphHelper.insert ( graph, rootNodeId, 1, g1 )
        graph = GraphHelper.insert ( graph, rootNodeId, 0, g2 )

        assert.equal
        ( graph.nodesById [ rootNodeId ].children
        , [ 'n2', 'n1' ]
        )
      }
    )

    it ( 'should add blocks', ( assert ) => {
        assert.equal
        ( Object.keys ( graph.blocksById ).sort ()
        , [ 'b0', 'b1', 'b2' ]
        )
      }
    )

    it ( 'should set child in nodesById', ( assert ) => {

        assert.equal
        ( graph.nodesById [ 'n1' ]
        , { blockId: 'b1'
          , id: 'n1'
          , parent: rootNodeId
          , children: []
          }
        )
      }
    )
  }
)

describe ( 'GraphHelper.slip', ( it ) => {
  // This graph has two objects and will be inserted in graph
  // between root and 'foo'
  // [ bar ]
  // [ baz ] [ bong ]
  const baz = GraphHelper.create ( 'baz', SOURCE_A )
  const bong = GraphHelper.create ( 'bong', SOURCE_A )
  let bar = GraphHelper.create ( 'bar', SOURCE_A )
  bar = GraphHelper.insert ( bar, rootNodeId, 0, baz )
  bar = GraphHelper.insert ( bar, rootNodeId, 1, bong )

  // [ main ]
  // [ foo ]
  let graph = GraphHelper.create ()
  const foo = GraphHelper.create ( 'foo', SOURCE_A )
  graph = GraphHelper.insert ( graph, rootNodeId, 0, foo )
  graph = GraphHelper.slip ( graph, rootNodeId, 0, bar )

  const nid: any = {}
  for ( const k in graph.nodesById ) {
    const node = graph.nodesById [ k ]
    const name = graph.blocksById [ node.blockId ].name
    nid [ name ] = k
  }

  // [ main ]
  // [ bar ]
  // [ baz ] [ bong ]
  // [ foo ]

  it ( 'should select block', ( assert ) => {
    assert.equal ( graph.blockId
    , graph.nodesById [ nid.bar ].blockId
    )
  })

  it ( 'should set blocks', ( assert ) => {
    assert.equal ( traverse ( graph )
    , [ 'n0:b0:main'
      , ' n2:b2:bar'
      , '  n3:b3:baz'
      , '   n1:b1:foo'
      , '  n4:b4:bong'
      ]
    )
  })

  it ( 'should set child in parent', ( assert ) => {
    assert.equal ( graph.nodesById [ rootNodeId ].children
    , [ nid.bar ]
    )
  })

  it ( 'should set previous child in new child', ( assert ) => {
    assert.equal ( graph.nodesById [ nid.baz ].children
    , [ nid.foo ]
    )
  })

  it ( 'should set parent', ( assert ) => {
    assert.equal ( graph.nodesById [ nid.foo ].parent
    , nid.baz
    )

    assert.equal ( graph.nodesById [ nid.baz ].parent
    , nid.bar
    )

    assert.equal ( graph.nodesById [ nid.bong ].parent
    , nid.bar
    )

    assert.equal ( graph.nodesById [ nid.bar ].parent
    , rootNodeId
    )
  })

})

describe ( 'GraphHelper.cut', ( it ) => {
  let graph = GraphHelper.create ()
  let g1 = GraphHelper.create ( 'foo', SOURCE_A )
  let g2 = GraphHelper.create ( 'bar', SOURCE_A )
  g1 = GraphHelper.insert ( g1, rootNodeId, 0, g2 )
  graph = GraphHelper.insert ( graph, rootNodeId, 1, g1 )
  // [ graph ] 'n0'
  //   null  [ foo ] 'n1'
  //         [ bar ] 'n2'
  graph = GraphHelper.cut ( graph, 'n1' )
  // [ foo ]
  // [ bar ]

  it ( 'create smaller graph', ( assert ) => {

    assert.equal
    ( Object.keys ( graph.nodesById ).sort ()
    , [ 'n0', 'n1' ]
    )

    assert.equal
    ( traverse ( graph )
    , [ 'n0:b0:foo'
      , ' n1:b1:bar'
      ]
    )
  })

  it ( 'should select block', ( assert ) => {
    assert.equal
    ( graph.blockId
    , rootBlockId
    )
  })
})

describe ( 'GraphHelper.drop', ( it ) => {
  let graph = GraphHelper.create ()
  let g1 = GraphHelper.create ( 'foo', SOURCE_A )
  let g2 = GraphHelper.create ( 'bar', SOURCE_A )
  g1 = GraphHelper.insert ( g1, rootNodeId, 0, g2 )
  graph = GraphHelper.insert ( graph, rootNodeId, 1, g1 )
  // [ graph ] 'n0'
  //   null  [ foo ] 'n1'
  //         [ bar ] 'n2'
  graph = GraphHelper.drop ( graph, 'n1' )
  // [ graph ] 'n0'

  it ( 'create smaller graph', ( assert ) => {
    assert.equal ( traverse ( graph ), [ 'n0:b0:main' ] )
  })

  it ( 'should select block', ( assert ) => {
    assert.equal ( graph.blockId, rootBlockId )
  })
})
