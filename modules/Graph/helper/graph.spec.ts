import { describe } from '../../Test/runner'
import { GraphType, BlockType } from '../types'
import { Graph } from './Graph'
import { Block } from './Block'

import { Immutable as IM } from './immutable'

const basePath = '/some/place'
const rootId = Block.rootNodeId
const SOURCE_A = ``

describe ( 'Graph.create', ( it ) => {
    const node  = Block.create ( 'hello' , SOURCE_A, basePath )
    const graph = Graph.create ( node )

    it ( 'store node in blocksById', ( assert ) => {
        assert.same
        ( graph.blocksById [ rootId ]
        , node
        )
      }
    )

    it ( 'create nodesById entry', ( assert ) => {
        assert.equal
        ( graph.nodesById [ rootId ]
        , { id: rootId, children: [], parent: null }
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

    it ( 'create with id', ( assert ) => {
        const anid = 'id99'
        const graph2 = Graph.create ( node, anid )
        assert.same
        ( graph2.blocksById [ anid ]
        , node
        )
      }
    )

    it ( 'should be immutable', ( assert ) => {
        assert.throws
        ( function () {
          graph.nodesById['foo'] = { id:'foo', children:[] }
          }
        )
      }
    )

  }
)

describe ( 'Graph.append', ( it ) => {
    const node = Block.create ( 'hello' , SOURCE_A, basePath )
    const graph = Graph.create ( node )

    it ( 'append child in parent', ( assert ) => {
        const node2 = Block.create ( 'foo', SOURCE_A, basePath )
        const graph2 = Graph.append ( graph, 'id0', node2 )
        assert.equal
        ( graph2.nodesById[ 'id0' ].children
        , [ 'id1' ]
        )
      }
    )

    it ( 'add child in nodes', ( assert ) => {
        const node2 = Block.create ( 'foo', SOURCE_A, basePath )
        const graph2 = Graph.append ( graph, 'id0', node2 )
        assert.equal
        ( graph2.nodes
        , [ 'id0', 'id1' ]
        )
      }
    )

    it ( 'add child in blocksById', ( assert ) => {
        const node2 = Block.create ( 'foo', SOURCE_A, basePath )
        const graph2 = Graph.append ( graph, 'id0', node2 )
        assert.same
        ( graph2.blocksById [ 'id1' ]
        , node2
        )
      }
    )

    it ( 'set child nodesById', ( assert ) => {
        const node2 = Block.create ( 'foo', SOURCE_A, basePath )
        const graph2 = Graph.append ( graph, 'id0', node2 )
        assert.equal
        ( graph2.nodesById[ 'id1' ]
        , { id: 'id1', parent: 'id0', children: [] }
        )
      }
    )
  }
)

describe ( 'Graph.insert', ( it ) => {
    const node = Block.create ( 'hello' , SOURCE_A, basePath )
    const graph = Graph.create ( node )

    it ( 'insert child in parent', ( assert ) => {
        const node1 = Block.create ( 'foo', SOURCE_A, basePath )
        const node2 = Block.create ( 'bar', SOURCE_A, basePath )
        let graph2 = Graph.insert ( graph, 'id0', 0, node1 )
        graph2 = Graph.insert ( graph2, 'id0', 0, node2 )
        assert.equal
        ( graph2.nodesById[ 'id0' ].children
        , [ 'id2', 'id1' ]
        )
        assert.same
        ( graph2.blocksById [ 'id2' ]
        , node2
        )
      }
    )

    it ( 'add child in nodes', ( assert ) => {
        const node1 = Block.create ( 'foo', SOURCE_A, basePath )
        const node2 = Block.create ( 'bar', SOURCE_A, basePath )
        let graph2 = Graph.insert ( graph, 'id0', 0, node1 )
        graph2 = Graph.insert ( graph2, 'id0', 0, node2 )
        assert.equal
        ( graph2.nodes
        , [ 'id0', 'id1', 'id2' ]
        )
      }
    )

    it ( 'add child in blocksById', ( assert ) => {
        const node2 = Block.create ( 'foo', SOURCE_A, basePath )
        const graph2 = Graph.insert ( graph, 'id0', 0, node2 )
        assert.same
        ( graph2.blocksById [ 'id1' ]
        , node2
        )
      }
    )

    it ( 'set child nodesById', ( assert ) => {
        const node2 = Block.create ( 'foo', SOURCE_A, basePath )
        const graph2 = Graph.insert ( graph, 'id0', 0, node2 )
        assert.equal
        ( graph2.nodesById[ 'id1' ]
        , { id: 'id1', parent: 'id0', children: [] }
        )
      }
    )
  }
)
