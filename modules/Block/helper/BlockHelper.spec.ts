import { describe } from '../../Test/runner'
import { BlockMetaType, BlockType, BlockByIdType } from '../BlockType'
import { BlockHelper } from './BlockHelper'

const SOURCE_A = `
/** Comment, show main context change { foo }
 */
export const render =
( ctx, child ) => {

}

export const meta =
{ author: 'John Difool'
, description: 'Do something'
, tags: [ '3D', 'three.js' ]
// If we use context changes
// we set this:
, expect: { bar: 'some.BarType' }
, provide: { foo: 'some.FooType' }
// If we use input/output return values,
// we set this:
, input: [ 'some.Type' ]
, output: 'some.OtherType'
}
`

const SOURCE_B = `
/** Comment, show main context change { foo }
 */
export const render =
( ctx, child, child2 ) => {

}
`

// Any or all 'meta' fields can be left blank.
export const meta: BlockMetaType =
{ author: 'John Difool'
, description: 'Do something'
, tags: [ '3D', 'three.js' ]
// If we use context changes
// we set this:
, expect: { bar: 'some.BarType' }
, provide: { foo: 'some.FooType' }
// If we use input/output return values,
// we set this:
, input: [ 'some.Type' ]
, output: 'some.OtherType'
}

describe ( 'BlockHelper.create', ( it ) => {
  it ( 'should set new _id', ( assert ) => {
    const node = BlockHelper.create ( 'hello' , SOURCE_A )
    assert.equal ( typeof node.id, 'string' )
  })

  it ( 'should set name', ( assert ) => {
    const node = BlockHelper.create ( 'hello' , SOURCE_A )
    assert.equal ( node.name, 'hello' )
  })

  it ( 'should set source', ( assert ) => {
    const node = BlockHelper.create ( 'hello' , SOURCE_A )
    assert.equal ( node.source, SOURCE_A )
  })

  it ( 'should compile js', ( assert ) => {
    const node = BlockHelper.create ( 'hello' , `export const render = () => 'hop'`)
    assert.equal
    ( node.js
    , "\"use strict\";\r\nexports.render = function () { return 'hop'; };\r\n"
    )
  })

  it ( 'should be immutable', ( assert ) => {
    const node = BlockHelper.create ( 'hello' , SOURCE_A )
    assert.throws ( () => { node.name = 'foobar' } )
  })

  it ( 'should parse source', ( assert ) => {
    const node = BlockHelper.create ( 'hello' , SOURCE_A )

    assert.equal ( node.input , [ 'some.Type' ] )

    assert.equal ( node.output , 'some.OtherType' )

    assert.equal
    ( node.meta
    , meta
    )
  })
})

describe ( 'BlockHelper.update', ( it ) => {
  const n = BlockHelper.create ( 'hello' , SOURCE_A )
  const node = BlockHelper.update
  ( n, { name: 'new name', source: SOURCE_B } )

  it ( 'should set name', ( assert ) => {
    assert.equal ( node.name , 'new name' )
  })

  it ( 'should set source', ( assert ) => {
    assert.equal ( node.source , SOURCE_B )
  })

  it ( 'should parse source', ( assert ) => {
    assert.equal ( node.input , [ 'any', 'any' ] )
    assert.equal ( node.output , 'any' )
    assert.equal ( node.meta, { provide: {}, expect: {} } )
  })
})
