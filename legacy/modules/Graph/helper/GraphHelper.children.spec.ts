import { describe } from '../../Test/runner'
import { GraphType, rootNodeId } from '../types'
import { createGraph, slipGraph, insertGraph } from './GraphHelper'
import { rootBlockId } from '../../Block/BlockType'

import { Immutable as IM } from './Immutable'

// [ main: [():string], ():void ]
// [ bar: [():number], ():string ]
// [ baz: [():number], ():number ] [ bong: *, ():void ]
// [ give: [():number], ():void ] <== lets foo be also used by baz
// [ foo: *, ():number ]
const SOURCE_main =
`export const update = () => {

}
export const meta =
{ children: [ '():string' ]
}
`

const SOURCE_bar =
`export const update = () => {}
export const meta =
{ children: [ '():number' ]
, update: '():string'
}
`

const SOURCE_baz =
`export const update = () => {}
export const meta =
{ children: [ '():number' ]
, update: '():number'
}
`

const SOURCE_bong =
`export const update = () => {}
`

const SOURCE_foo =
`export const update = () => {}
export const meta =
{ update: '():number'
}
`

const SOURCE_give =
`export const update = () => {}
export const meta =
{ children: [ '():number' ]
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

describe ( 'GraphHelper.check of children', ( it, setupDone ) => {
  // ======= async setup =======
  // This graph has two objects and will be inserted in graph
  // between main and foo
  let baz: GraphType
  let bong: GraphType
  let bar: GraphType

  let main: GraphType
  let foo: GraphType
  let give: GraphType

  let main2: GraphType
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
    , createGraph ( 'give', SOURCE_give )
      .then ( ( g ) => { give = g } )
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
    console.log ( 'Error in GraphHelper.children.spec setup', err )
  })
  // ======= async done  =======


  it ( 'should disable invalid node', ( assert ) => {
    const node = main.nodesById [ 'n0' ]
    assert.equal ( node.invalid, true )
    assert.equal
    ( node.serr
    , [ "invalid child 1: ():number instead of ():string"
      ]
    )
  })

  it ( 'should check on update', ( assert ) => {
    const node = main2.nodesById [ nid.foo ]
    assert.same ( node.invalid, undefined )
  })

  it ( 'should invalidate detached node', ( assert ) => {
    const node = main2.nodesById [ nid.bong ]
    assert.same ( node.invalid, true )
  })

  it ( 'should steal child from children', ( assert ) => {
    const graph3 = slipGraph ( main2, nid.baz, 0, give )
    // [ main ]
    // [ bar  ]
    // [ baz  ] [ bong ]
    // [ give ]
    // [ foo ]

    // Now 'baz' uses 'foo' during processing
    const node = graph3.nodesById [ nid.baz ]
    assert.same ( node.invalid, undefined )
    assert.equal ( nid.foo, node.childrenm [ 0 ] )
  })


})
