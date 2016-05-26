import { describe } from '../../Test/runner'
import { GraphType } from '../types'
import { GraphHelper } from './GraphHelper'
import { NodeHelper } from './NodeHelper'
import { BlockHelper } from '../../Block'

import { Immutable as IM } from './Immutable'

const rootId = NodeHelper.rootNodeId
const SOURCE_A = ``

describe ( 'GraphHelper.create', ( it ) => {
    const block = BlockHelper.create ( 'main' )
    const graph = GraphHelper.create ( block )

    it ( 'create node for block', ( assert ) => {
        assert.equal
        ( graph.nodesById [ rootId ]
        , { id: rootId
          , blockId: block._id
          , parent: null
          , children: []
          }
        )
      }
    )

    it ( 'create nodes entry', ( assert ) => {
        assert.equal
        ( graph.nodes
        , [ 'id0' ]
        )
      }
    )

    it ( 'should be immutable', ( assert ) => {
        assert.throws
        ( function () {
            graph.nodesById [ 'foo' ] =
            NodeHelper.create ( 'abc', 'idid', null )
          }
        )
      }
    )

  }
)

describe ( 'GraphHelper.append', ( it ) => {
    const block = BlockHelper.create ( 'main' )
    const graph = GraphHelper.create ( block )
    const block2 = BlockHelper.create ( 'foo', SOURCE_A )
    const graph2 = GraphHelper.append ( graph, 'id0', block2 )

    it ( 'append child in parent', ( assert ) => {

        assert.equal
        ( graph2.nodesById [ 'id0' ].children
        , [ 'id1' ]
        )
      }
    )

    it ( 'add child in nodes', ( assert ) => {
        assert.equal
        ( graph2.nodes
        , [ 'id0', 'id1' ]
        )
      }
    )

    it ( 'add new node in nodesById', ( assert ) => {
        assert.equal
        ( graph2.nodesById [ 'id1' ]
        , { id: 'id1'
          , blockId: block2._id
          , parent: 'id0'
          , children: []
          }
        )
      }
    )

  }
)

describe ( 'GraphHelper.insert', ( it ) => {
    const block = BlockHelper.create ( 'main' )
    const graph = GraphHelper.create ( block )
    const block1 = BlockHelper.create ( 'foo', SOURCE_A )
    const block2 = BlockHelper.create ( 'bar', SOURCE_A )
    let graph2 = GraphHelper.insert ( graph, 'id0', 0, block1 )
        graph2 = GraphHelper.insert ( graph2, 'id0', 0, block2 )

    it ( 'insert child in parent', ( assert ) => {

        assert.equal
        ( graph2.nodesById [ 'id0' ].children
        , [ 'id2', 'id1' ]
        )
      }
    )

    it ( 'insert null', ( assert ) => {
    let graph3 = GraphHelper.insert ( graph, 'id0', 1, block1 )
        assert.equal
        ( graph3.nodesById [ 'id0' ].children
        , [ null, 'id1' ]
        )
      }
    )

    it ( 'replace null', ( assert ) => {
    let graph3 = GraphHelper.insert ( graph, 'id0', 1, block1 )
        graph3 = GraphHelper.insert ( graph2, 'id0', 0, block2 )

        assert.equal
        ( graph2.nodesById [ 'id0' ].children
        , [ 'id2', 'id1' ]
        )
      }
    )

    it ( 'add child in nodes', ( assert ) => {

        assert.equal
        ( graph2.nodes
        , [ 'id0', 'id1', 'id2' ]
        )
      }
    )

    it ( 'set child nodesById', ( assert ) => {

        assert.equal
        ( graph2.nodesById [ 'id1' ]
        , { blockId: block1._id, id: 'id1', parent: 'id0', children: [] }
        )
      }
    )
  }
)
