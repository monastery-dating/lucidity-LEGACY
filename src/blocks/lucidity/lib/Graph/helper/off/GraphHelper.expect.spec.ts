import { describe } from '../../Test/runner'
import { GraphType, rootNodeId } from '../types'
import { createGraph, insertGraph, slipGraph } from './GraphHelper'
import { rootBlockId } from '../../Block/BlockType'

import { Immutable as IM } from './Immutable'

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

describe ( 'GraphHelper.check of expect', ( it, setupDone ) => {
  let baz: GraphType
  let bong: GraphType
  let bar: GraphType
  let main: GraphType
  let main2: GraphType
  let foo: GraphType
  const nid: any = {}

  Promise.all
  ( [ createGraph ( 'baz', SOURCE_baz )
      .then ( ( g ) => { baz = g } )
    , createGraph ( 'bong', SOURCE_bong )
      .then ( ( g ) => { bong = g } )
    , createGraph ( 'bar', SOURCE_bar )
      .then ( ( g ) => { bar = g } )
    , createGraph ( 'main', SOURCE_main )
      .then ( ( g ) => { main = g } )
    , createGraph ( 'foo', SOURCE_foo )
      .then ( ( g ) => { foo = g } )
    ]
  )
  .then ( () => {
    bar = insertGraph ( bar, rootNodeId, 0, baz )
    bar = insertGraph ( bar, rootNodeId, 1, bong )
    // [ bar ]
    // [ baz ] [ bong ]

    main = insertGraph ( main, rootNodeId, 0, foo )
    // [ main ]
    // [ foo ]

    main2 = slipGraph ( main, rootNodeId, 0, bar )
    // [ main ]
    // [ bar ]
    // [ baz ] [ bong ]
    // [ foo ]

    for ( const k in main2.nodesById ) {
      const node = main2.nodesById [ k ]
      const name = main2.blocksById [ node.blockId ].name
      nid [ name ] = k
    }

    setupDone ()
  })
  .catch ( ( err ) => {
    console.log ( 'Error in GraphHelper.expect.spec setup', err )
  })

  // This graph has two objects and will be inserted in graph
  // between root and 'foo'
  // [ bar ]
  // [ baz ] [ bong ]


  // [ main ]
  // [ foo ]

  it ( 'should disable invalid node', ( assert ) => {
    const node = main.nodesById [ 'n1' ]
    const block = main.blocksById [ node.blockId ]
    assert.equal ( node.invalid, true )
    assert.equal
    ( node.cerr
    , [ "invalid 'bar': bar.bad instead of bar.type"
      , "missing 'baz': baz.type"
      ]
    )
  })


  it ( 'should update node check', ( assert ) => {
    const node = main2.nodesById [ nid.foo ]
    assert.same ( node.invalid, undefined )
  })

})
