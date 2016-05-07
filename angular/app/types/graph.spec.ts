/// <reference path="../../typings/jasmine/jasmine.d.ts" />
import { NodeType } from './node.type'
import { GraphType } from './graph.type'
import * as Graph from './graph.helper'
import * as Node from './node.helper'

const basePath = '/some/place'
const rootId = Node.rootNodeId

describe
( 'Graph.create', () => {
    let node : NodeType
    let graph : GraphType
    beforeEach
    ( () => {
        node  = Node.create ( 'hello' , SOURCE_A, basePath )
        graph = Graph.create ( node )
      }
    )

    it ( 'store node in nodesById', () => {
        expect ( graph.nodesById [ rootId ] )
        .toBe ( node )
      }
    )

    it ( 'create linksById entry', () => {
        expect ( graph.linksById [ rootId ] )
        .toEqual ( { id: rootId, children: [], parent: null } )
      }
    )

    it ( 'create nodes entry', () => {
        expect ( graph.nodes )
        .toEqual ( [ 'id0' ] )
      }
    )

    it ( 'create with id', () => {
        const anid = 'id99'
        const graph2 = Graph.create ( node, anid )
        expect ( graph2.nodesById [ anid ] )
        .toBe ( node )
      }
    )

    it ( 'should be immutable', () => {
        expect
        ( function () {
          graph.linksById['foo'] = { id:'foo', children:[] }
          }
        )
        .toThrow ()
      }
    )
  }
)

describe
( 'Graph.append', () => {
    let node : NodeType
    let graph : GraphType
    beforeEach
    ( () => {
        node = Node.create ( 'hello' , SOURCE_A, basePath )
        graph = Graph.create ( node )
      }
    )

    it ( 'append child in parent', () => {
        const node2 = Node.create ( 'foo', SOURCE_A, basePath )
        const graph2 = Graph.append ( graph, 'id0', node2 )
        expect ( graph2.linksById[ 'id0' ].children )
        .toEqual ( [ 'id1' ] )
      }
    )

    it ( 'add child in nodes', () => {
        const node2 = Node.create ( 'foo', SOURCE_A, basePath )
        const graph2 = Graph.append ( graph, 'id0', node2 )
        expect ( graph2.nodes )
        .toEqual ( [ 'id0', 'id1' ] )
      }
    )

    it ( 'add child in nodesById', () => {
        const node2 = Node.create ( 'foo', SOURCE_A, basePath )
        const graph2 = Graph.append ( graph, 'id0', node2 )
        expect ( graph2.nodesById [ 'id1' ] )
        .toBe ( node2 )
      }
    )

    it ( 'set child linksById', () => {
        const node2 = Node.create ( 'foo', SOURCE_A, basePath )
        const graph2 = Graph.append ( graph, 'id0', node2 )
        expect ( graph2.linksById[ 'id1' ] )
        .toEqual ( { id: 'id1', parent: 'id0', children: [] } )
      }
    )
  }
)

describe
( 'Graph.insert', () => {
    let node : NodeType
    let graph : GraphType
    beforeEach
    ( () => {
        node = Node.create ( 'hello' , SOURCE_A, basePath )
        graph = Graph.create ( node )
      }
    )

    it ( 'insert child in parent', () => {
        const node1 = Node.create ( 'foo', SOURCE_A, basePath )
        const node2 = Node.create ( 'bar', SOURCE_A, basePath )
        let graph2 = Graph.insert ( graph, 'id0', 0, node1 )
        graph2 = Graph.insert ( graph2, 'id0', 0, node2 )
        expect ( graph2.linksById[ 'id0' ].children )
        .toEqual ( [ 'id2', 'id1' ] )
        expect ( graph2.nodesById [ 'id2' ] )
        .toBe ( node2 )
      }
    )

    it ( 'add child in nodes', () => {
        const node1 = Node.create ( 'foo', SOURCE_A, basePath )
        const node2 = Node.create ( 'bar', SOURCE_A, basePath )
        let graph2 = Graph.insert ( graph, 'id0', 0, node1 )
        graph2 = Graph.insert ( graph2, 'id0', 0, node2 )
        expect ( graph2.nodes )
        .toEqual ( [ 'id0', 'id1', 'id2' ] )
      }
    )

    it ( 'add child in nodesById', () => {
        const node2 = Node.create ( 'foo', SOURCE_A, basePath )
        const graph2 = Graph.insert ( graph, 'id0', 0, node2 )
        expect ( graph2.nodesById [ 'id1' ] )
        .toBe ( node2 )
      }
    )

    it ( 'set child linksById', () => {
        const node2 = Node.create ( 'foo', SOURCE_A, basePath )
        const graph2 = Graph.insert ( graph, 'id0', 0, node2 )
        expect ( graph2.linksById[ 'id1' ] )
        .toEqual ( { id: 'id1', parent: 'id0', children: [] } )
      }
    )
  }
)

// ============================================= Source code for testing
const SOURCE_A = ``
