import { describe } from '../../Test/runner'
import { BlockType, BlockByIdType } from '../BlockType'
import { Meta } from 'lucidity'
import { createBlock, normalizeType, extractMeta, updateBlock } from './BlockHelper'

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

describe ( 'createBlock', ( it, setupDone ) => {
  let block: BlockType
  createBlock ( 'hello' , SOURCE_A )
  .then ( ( b ) => {
    block = b
    setupDone ()
  })

  it ( 'should set new _id', ( assert ) => {
    assert.equal ( typeof block.id, 'string' )
  })

  it ( 'should set name', ( assert ) => {
    assert.equal ( block.name, 'hello' )
  })

  it ( 'should set source', ( assert ) => {
    assert.equal ( block.source, SOURCE_A )
  })

  it ( 'should compile js', ( assert, done ) => {
    createBlock
    ( 'hello'
    , `interface Foo {}\nexport const update = () => 'hop'`
    )
    .then ( ( block ) => {
      assert.equal
      ( block.js
      , "\"use strict\";\nexports.update = () => 'hop';\n"
      )
      done ()
    })
  })

  it ( 'should be immutable', ( assert ) => {
    assert.throws ( () => { block.name = 'foobar' } )
  })

  it ( 'should parse source', ( assert ) => {
    assert.equal ( typeof block.js, 'string' )
    assert.equal ( typeof extractMeta, 'function' )

    assert.equal
    ( block.meta
    , extractMeta ( { meta, update () {} } )
    )
  })

  it ( 'should set isvoid', ( assert ) => {
    assert.same ( block.meta.isvoid, true )
  })
})

describe ( 'updateBlock', ( it ) => {
  const update = ( changes, clbk ) => {
    createBlock ( 'hello' , SOURCE_A )
    .then ( ( b ) => {
      updateBlock ( b, changes )
      .then ( ( b2 ) => {
        clbk ( null, b2, b )
      })
      .catch ( clbk )
    })
  }

  it ( 'should set name', ( assert, done ) => {
    update ( { name: 'new name', source: SOURCE_B }, ( err, block ) => {
      assert.equal ( block.name , 'new name' )
      done ()
    })
  })

  it ( 'should set source', ( assert, done ) => {
    update ( { name: 'new name', source: SOURCE_B }, ( err, block ) => {
      assert.equal ( block.source , SOURCE_B )
      done ()
    })
  })

  it ( 'should parse source', ( assert, done ) => {
    update ( { name: 'new name', source: SOURCE_B }, ( err, b2, b1 ) => {
      assert.notSame ( b2.js, b1.js )
      assert.same ( b2.meta.update, undefined )
      assert.same ( b2.meta.isvoid, true )
      done ()
    })
  })

  it ( 'should set isvoid', ( assert, done ) => {
    update ( { source: 'export const update = () => {}'}, ( err, block ) => {
      assert.same ( block.meta.isvoid, true )
    })
  })
})

describe ( 'normalizeType', ( it ) => {
  const n = normalizeType

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

describe ( 'extractMeta', ( it ) => {
  const m = extractMeta ( { meta, update () {} } )

  it ( 'should normalize children types', ( assert ) => {
    assert.equal
    ( m.children
    , [ '():some.Type' ]
    )
  })

  it ( 'should set all on children: all', ( assert ) => {
    const meta2 = Object.assign ( {}, meta, { children: 'all' } )
    const m = extractMeta ( { meta: meta2, update () {} } )
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
