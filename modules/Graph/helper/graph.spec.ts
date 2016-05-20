import { describe } from '../../Test/runner'
import { GraphType, NodeType } from '../types'
import { Graph } from './graph.helper'
import { Node } from './node.helper'

import { Immutable as IM } from './immutable'

const basePath = '/some/place'
const rootId = Node.rootNodeId
const SOURCE_A = ``

describe ( 'Graph.create', ( it ) => {
    const node  = Node.create ( 'hello' , SOURCE_A, basePath )
    const graph = Graph.create ( node )

    it ( 'store node in nodesById', ( assert ) => {
        assert.same
        ( graph.nodesById [ rootId ]
        , node
        )
      }
    )

    it ( 'create linksById entry', ( assert ) => {
        assert.equal
        ( graph.linksById [ rootId ]
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
        ( graph2.nodesById [ anid ]
        , node
        )
      }
    )

    it ( 'should be immutable', ( assert ) => {
        assert.throws
        ( function () {
          graph.linksById['foo'] = { id:'foo', children:[] }
          }
        )
      }
    )

  }
)

describe ( 'Graph.append', ( it ) => {
    const node = Node.create ( 'hello' , SOURCE_A, basePath )
    const graph = Graph.create ( node )

    it ( 'append child in parent', ( assert ) => {
        const node2 = Node.create ( 'foo', SOURCE_A, basePath )
        const graph2 = Graph.append ( graph, 'id0', node2 )
        assert.equal
        ( graph2.linksById[ 'id0' ].children
        , [ 'id1' ]
        )
      }
    )

    it ( 'add child in nodes', ( assert ) => {
        const node2 = Node.create ( 'foo', SOURCE_A, basePath )
        const graph2 = Graph.append ( graph, 'id0', node2 )
        assert.equal
        ( graph2.nodes
        , [ 'id0', 'id1' ]
        )
      }
    )

    it ( 'add child in nodesById', ( assert ) => {
        const node2 = Node.create ( 'foo', SOURCE_A, basePath )
        const graph2 = Graph.append ( graph, 'id0', node2 )
        assert.same
        ( graph2.nodesById [ 'id1' ]
        , node2
        )
      }
    )

    it ( 'set child linksById', ( assert ) => {
        const node2 = Node.create ( 'foo', SOURCE_A, basePath )
        const graph2 = Graph.append ( graph, 'id0', node2 )
        assert.equal
        ( graph2.linksById[ 'id1' ]
        , { id: 'id1', parent: 'id0', children: [] }
        )
      }
    )
  }
)

describe ( 'Graph.insert', ( it ) => {
    const node = Node.create ( 'hello' , SOURCE_A, basePath )
    const graph = Graph.create ( node )

    it ( 'insert child in parent', ( assert ) => {
        const node1 = Node.create ( 'foo', SOURCE_A, basePath )
        const node2 = Node.create ( 'bar', SOURCE_A, basePath )
        let graph2 = Graph.insert ( graph, 'id0', 0, node1 )
        graph2 = Graph.insert ( graph2, 'id0', 0, node2 )
        assert.equal
        ( graph2.linksById[ 'id0' ].children
        , [ 'id2', 'id1' ]
        )
        assert.same
        ( graph2.nodesById [ 'id2' ]
        , node2
        )
      }
    )

    it ( 'add child in nodes', ( assert ) => {
        const node1 = Node.create ( 'foo', SOURCE_A, basePath )
        const node2 = Node.create ( 'bar', SOURCE_A, basePath )
        let graph2 = Graph.insert ( graph, 'id0', 0, node1 )
        graph2 = Graph.insert ( graph2, 'id0', 0, node2 )
        assert.equal
        ( graph2.nodes
        , [ 'id0', 'id1', 'id2' ]
        )
      }
    )

    it ( 'add child in nodesById', ( assert ) => {
        const node2 = Node.create ( 'foo', SOURCE_A, basePath )
        const graph2 = Graph.insert ( graph, 'id0', 0, node2 )
        assert.same
        ( graph2.nodesById [ 'id1' ]
        , node2
        )
      }
    )

    it ( 'set child linksById', ( assert ) => {
        const node2 = Node.create ( 'foo', SOURCE_A, basePath )
        const graph2 = Graph.insert ( graph, 'id0', 0, node2 )
        assert.equal
        ( graph2.linksById[ 'id1' ]
        , { id: 'id1', parent: 'id0', children: [] }
        )
      }
    )
  }
)
