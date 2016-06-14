import { describe } from '../../Test/runner'
import { GraphType } from '../types'
import { GraphHelper } from './GraphHelper'
import { NodeHelper } from './NodeHelper'
import { BlockHelper } from '../../Block'

import { Immutable as IM } from './Immutable'

const rootNodeId = NodeHelper.rootNodeId
const rootBlockId = BlockHelper.rootBlockId

// [ main ]
// [ bar ]
// [ baz ] [ bong ]
// [ foo ]
const SOURCE_main =
`export const render = ( ctx, child ) => {
  child ( ctx.set ( { bar: 'bad' } ) )
}
export const meta =
{ provide: { bar: 'bar.bad' }
}
`

const SOURCE_bar =
`export const render = ( ctx, child, child2 ) => {}
export const meta =
{ provide: { bar: 'bar.type' }
}
`

const SOURCE_baz =
`export const render = ( ctx, child, child2 ) => {}
export const meta =
{ provide: { baz: 'baz.type' }
, expect: { bar: 'bar.type' }
}
`

const SOURCE_bong =
`export const render = ( ctx, child, child2 ) => {}
`

const SOURCE_foo =
`export const render = ( ctx, child, child2 ) => {}
export const meta =
{ expect: { bar: 'bar.type', baz: 'baz.type' }
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

describe ( 'GraphHelper.check of expect', ( it ) => {
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
    const node = graph1.nodesById [ 'n1' ]
    const block = graph1.blocksById [ node.blockId ]
    assert.equal ( node.invalid, true )
    assert.equal
    ( node.cerr
    , [ "invalid 'bar': bar.bad instead of bar.type"
      , "missing 'baz': baz.type"
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

  it ( 'should update node check', ( assert ) => {
    const node = graph2.nodesById [ nid.foo ]
    assert.same ( node.invalid, undefined )
  })

})
