/// <reference path="../../typings/jasmine/jasmine.d.ts" />
import { NodeType } from './node.type'
import { GraphType } from './graph.type'
import * as Graph from './graph.helper'
import * as Node from './node.helper'

const basePath = '/some/place'
const rootId = Graph.rootGraphId

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
    it ( 'store node in nodes', () => {
        expect ( graph.nodes [ rootId ] )
        .toBe ( node )
      }
    )
    it ( 'create links entry', () => {
        expect ( graph.links [ rootId ] )
        .toEqual ( { id: rootId, children: [], parent: null } )
      }
    )
    it ( 'create with id', () => {
        const anid = 'id99'
        const graph2 = Graph.create ( node, anid )
        expect ( graph2.nodes [ anid ] )
        .toBe ( node )
      }
    )
    it ( 'should be immutable', () => {
        expect
        ( function () {
          graph.links['foo'] = { id:'foo', children:[] }
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
        expect ( graph2.links [ 'id0' ].children )
        .toEqual ( [ 'id1' ] )
      }
    )
    it ( 'add child in nodes', () => {
        const node2 = Node.create ( 'foo', SOURCE_A, basePath )
        const graph2 = Graph.append ( graph, 'id0', node2 )
        expect ( graph2.nodes [ 'id1' ] )
        .toBe ( node2 )
      }
    )
    it ( 'set child links', () => {
        const node2 = Node.create ( 'foo', SOURCE_A, basePath )
        const graph2 = Graph.append ( graph, 'id0', node2 )
        expect ( graph2.links [ 'id1' ] )
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
        expect ( graph2.links [ 'id0' ].children )
        .toEqual ( [ 'id2', 'id1' ] )
        expect ( graph2.nodes [ 'id2' ] )
        .toBe ( node2 )
      }
    )
    it ( 'add child in nodes', () => {
        const node2 = Node.create ( 'foo', SOURCE_A, basePath )
        const graph2 = Graph.insert ( graph, 'id0', 0, node2 )
        expect ( graph2.nodes [ 'id1' ] )
        .toBe ( node2 )
      }
    )
    it ( 'set child links', () => {
        const node2 = Node.create ( 'foo', SOURCE_A, basePath )
        const graph2 = Graph.insert ( graph, 'id0', 0, node2 )
        expect ( graph2.links [ 'id1' ] )
        .toEqual ( { id: 'id1', parent: 'id0', children: [] } )
      }
    )
  }
)

describe
( 'Graph.nextGraphId', () => {
    it ( 'should return id0 on empty graph', () => {
        expect
        ( Graph.nextGraphId ( <GraphType> { nodes: {} } )
        )
        .toEqual ( 'id0' )
      }
    )

    it ( 'should return first free in graph', () => {
        const n = Node.create ( 'foo', '', '' )
        expect
        ( Graph.nextGraphId
          ( <GraphType> { nodes: { id0: n, id3: n }, links: {} }
          )
        )
        .toEqual ( 'id1' )
      }
    )
  }
)

// ============================================= Source code for testing
const SOURCE_A = ``
