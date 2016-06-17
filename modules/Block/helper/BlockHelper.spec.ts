import { describe } from '../../Test/runner'
import { BlockType, BlockByIdType } from '../BlockType'
import { Meta } from 'lucidity'
import { BlockHelper } from './BlockHelper'

const SOURCE_A = `
import { Update, Meta } from 'lucidity'
/** Comment, show main context change { foo }
 */
export const update: Update =
() => {

}

export const meta: Meta =
{ description: 'Do something'
, tags: [ '3D', 'three.js' ]
, author: 'John Difool'
, origin: 'lucidity.io/some.Test'
, version: '1.0'
// If we use context changes
// we set this:
, expect: { bar: 'some.BarType' }
, provide: { foo: 'some.FooType' }
// If we use input/output return values,
// we set this:
, children: [ '():some.Type' ]
, update: '( a: number ):some.OtherType'
}
`

const SOURCE_B = `
let child
export const init =
( { children } ) => {
  child = children [ 0 ]
}
export const update =
() => {
  child ()
}
export const meta =
{ children: [ '():b.Type' ]
}
`

const meta: Meta =
{ description: 'Do something'
, tags: [ '3D', 'three.js' ]
, author: 'John Difool'
, origin: 'lucidity.io/some.Test'
, version: '1.0'
// If we use context changes
// we set this:
, expect: { bar: 'some.BarType' }
, provide: { foo: 'some.FooType' }
// If we use input/output return values,
// we set this:
, children: [ '():some.Type' ]
, update: '( a: number ):some.OtherType'
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
    const node = BlockHelper.create ( 'hello' , `interface Foo {}\nexport const update = () => 'hop'`)
    assert.equal
    ( node.js
    , "\"use strict\";\nexports.update = () => 'hop';\n"
    )
  })

  it ( 'should be immutable', ( assert ) => {
    const node = BlockHelper.create ( 'hello' , SOURCE_A )
    assert.throws ( () => { node.name = 'foobar' } )
  })

  it ( 'should parse source', ( assert ) => {
    const node = BlockHelper.create ( 'hello' , SOURCE_A )

    assert.equal ( typeof node.js, 'string' )

    assert.equal
    ( node.meta
    , BlockHelper.parseMeta ( { meta, update () {} } )
    )
  })

  it ( 'should set isvoid', ( assert ) => {
    const node = BlockHelper.create ( 'voodoo', 'export const update = () => {}')
    assert.same ( node.meta.isvoid, true )
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
    assert.notSame ( node.js, n.js )
    assert.same ( node.meta.update, undefined )
    assert.same ( node.meta.isvoid, true )
  })

  it ( 'should set isvoid', ( assert ) => {
    const node = BlockHelper.update ( n, { source: 'export const update = () => {}' } )
    assert.same ( node.meta.isvoid, true )
  })
})

describe ( 'BlockHelper.normalizeType', ( it ) => {
  const n = BlockHelper.normalizeType

  it ( 'should remove white space and variable names', ( assert ) => {
    assert.same
    ( n ( ' ( a : number , b : some.Type ) : bar.Foo' )
    , '(number,some.Type):bar.Foo'
    )
  })

  it ( 'should allow type without arguments', ( assert ) => {
    assert.same ( n ( ' ( ) : number ' ), '():number' )
  })

  it ( 'should allow type no return value', ( assert ) => {
    assert.same
    ( n ( ' (a:number, b:boolean ) : void' )
    , '(number,boolean):void'
    )
  })

  it ( 'should reject invalid types', ( assert ) => {
    assert.throws ( () => n ( '(a:number, b:boolean  : void' ) )
    assert.throws ( () => n ( ' a:number, b:boolean  : void' ) )
    assert.throws ( () => n ( ' a:number, b:boolean) : void' ) )
    assert.throws ( () => n ( '(a, b) : void' ) )
    assert.throws ( () => n ( '(a: number) void' ) )
    assert.throws ( () => n ( '(a: number)' ) )
  })

})

describe ( 'BlockHelper.parseMeta', ( it ) => {
  const m = BlockHelper.parseMeta ( { meta, update () {} } )

  it ( 'should normalize children types', ( assert ) => {
    assert.equal
    ( m.children
    , [ '():some.Type' ]
    )
  })

  it ( 'should set all on children: all', ( assert ) => {
    const meta2 = Object.assign ( {}, meta, { children: 'all' } )
    const m = BlockHelper.parseMeta ( { meta: meta2, update () {} } )
    assert.equal
    ( m.provide
    , { foo: 'some.FooType' }
    )
  })

  it ( 'should normalize update type', ( assert ) => {
    assert.equal
    ( m.update
    , '(number):some.OtherType'
    )
  })

  it ( 'should normalize expect type map', ( assert ) => {
    assert.equal
    ( m.expect
    , { bar: 'some.BarType' }
    )
  })

  it ( 'should normalize provide type map', ( assert ) => {
    assert.equal
    ( m.provide
    , { foo: 'some.FooType' }
    )
  })

})
