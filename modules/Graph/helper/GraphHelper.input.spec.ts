import { describe } from '../../Test/runner'
import { GraphType } from '../types'
import { GraphHelper } from './GraphHelper'
import { NodeHelper } from './NodeHelper'
import { BlockHelper } from '../../Block'

import { Immutable as IM } from './Immutable'

const rootNodeId = NodeHelper.rootNodeId
const rootBlockId = BlockHelper.rootBlockId

// [ main: [string] -> void ]
// [ bar: [number] -> string ]
// [ baz: [number] -> number ] [ bong: [] -> any ]
// [ foo: [] -> number ]
const SOURCE_main =
`export const render = ( ctx, child ) => {
  child ( ctx.set ( { bar: 'bad' } ) )
}
export const meta =
{ input: [ 'string' ]
}
`

const SOURCE_bar =
`export const render = ( ctx, child ) => {}
export const meta =
{ input: [ 'number' ]
, output: 'string'
}
`

const SOURCE_baz =
`export const render = ( ctx, child ) => {}
export const meta =
{ input: [ 'number' ]
, output: 'number'
}
`

const SOURCE_bong =
`export const render = ( ctx ) => {}
`

const SOURCE_foo =
`export const render = ( ctx ) => {}
export const meta =
{ output: 'number'
}
`


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

describe ( 'GraphHelper.check input', ( it ) => {
  // This graph has two objects and will be inserted in graph
  // between root and 'foo'
  // [ bar ]
  // [ baz ] [ bong ]
  const baz = GraphHelper.create ( 'baz', SOURCE_baz )
  const bong = GraphHelper.create ( 'bong', SOURCE_bong )
  let bar = GraphHelper.create ( 'bar', SOURCE_bar )
  bar = GraphHelper.insert ( bar, rootNodeId, 0, baz )
  bar = GraphHelper.insert ( bar, rootNodeId, 1, bong )

  // [ main ]
  // [ foo ]
  let graph1 = GraphHelper.create ( 'main', SOURCE_main )
  const foo = GraphHelper.create ( 'foo', SOURCE_foo )
  graph1 = GraphHelper.insert ( graph1, rootNodeId, 0, foo )

  it ( 'should disable invalid node', ( assert ) => {
    const node = graph1.nodesById [ 'n0' ]
    assert.equal ( node.invalid, true )
    assert.equal
    ( node.serr
    , [ "invalid child 1 (number instead of string)"
      ]
    )
  })

  const graph2 = GraphHelper.slip ( graph1, rootNodeId, 0, bar )
  // [ main ]
  // [ bar ]
  // [ baz ] [ bong ]
  // [ foo ]

  const nid: any = {}
  for ( const k in graph2.nodesById ) {
    const node = graph2.nodesById [ k ]
    const name = graph2.blocksById [ node.blockId ].name
    nid [ name ] = k
  }

  it ( 'should check on update', ( assert ) => {
    const node = graph2.nodesById [ nid.foo ]
    assert.same ( node.invalid, undefined )
  })

  it ( 'should invalidate detached node', ( assert ) => {
    const node = graph2.nodesById [ nid.bong ]
    assert.same ( node.invalid, true )
  })


})
