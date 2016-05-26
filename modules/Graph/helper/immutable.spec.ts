import { describe } from '../../Test/runner'
import { Immutable as IM } from './Immutable'

describe ( 'IM.merge', ( it ) => {
    it ( 'should create new object', ( assert ) => {
        const a = {}
        const b = {}
        assert.notSame
        ( IM.merge ( a, b ), a )
        assert.notSame
        ( IM.merge ( a, b ), b )
      }
    )

    it ( 'should create frozen object', ( assert ) => {
        const a = IM.merge ( { name: 'hello' }, {} )
        assert.throws
        ( function () {
            a.name = 'hop'
          }
        )
      }
    )

    it ( 'should merge new values', ( assert ) => {
        const a = { a: 3 }
        const b = { x: 1 }
        assert.equal
        ( IM.merge ( a, b )
        , { a: 3, x: 1 }
        )
      }
    )

    it ( 'should replace values', ( assert ) => {
        const a = { a: 3, x: 3 }
        const b = { x: 1 }
        assert.equal
        ( IM.merge ( a, b )
        , { a: 3, x: 1 }
        )
      }
    )

  }
)

describe ( 'IM.remove', ( it ) => {
    const a = { a: 3, b: { c: 4, d: 5 }, e: 6 }

    it ( 'should create new object', ( assert ) => {
        assert.notSame
        ( IM.remove ( a, 'b' )
        , a
        )
      }
    )

    it ( 'should create frozen object', ( assert ) => {
        const b = IM.remove ( a, 'b' )
        assert.throws
        ( function () {
            b.a = 34
          }
        )
      }
    )

    it ( 'should delete value', ( assert ) => {
        assert.equal
        ( IM.remove ( a, 'b' )
        , { a: 3, e: 6 }
        )
      }
    )
  }
)

describe ( 'IM.append', ( it ) => {
    it ( 'should create new object' , ( assert ) => {
        const a = [10]
        const b = 20
        assert.notSame
        ( IM.append ( a, b )
        , a
        )
      }
    )

    it ( 'should create frozen object', ( assert ) => {
        const a = IM.append ( [], 1 )
        assert.throws
        ( function () {
            a[0] = 100
          }
        )
      }
    )

    it ( 'should append new values', ( assert ) => {
        const a = [10,20]
        const b = 30
        assert.equal
        ( IM.append ( a, b )
        , [ 10, 20, 30 ]
        )
      }
    )

    it ( 'should append and sort', ( assert ) => {
        const a = [10,20]
        const b = 15
        assert.equal
        ( IM.append ( a, b, ( a, b ) => a < b ? -1 : 1 )
        , [ 10, 15, 20 ]
        )
      }
    )
  }
)

describe ( 'IM.insert', ( it ) => {
    it ( 'should create new object', ( assert ) => {
        const a = [10]
        const b = 20
        assert.notSame
        ( IM.insert ( a, 0, b )
        , a
        )
      }
    )

    it ( 'should create frozen object', ( assert ) => {
        const a = IM.insert ( [], 0, 1 )
        assert.throws
        ( function () {
            a[0] = 100
          }
        )
      }
    )

    it ( 'should insert new value', ( assert ) => {
        const a = [10,20]
        const b = 30
        assert.equal
        ( IM.insert ( a, 1, b )
        , [ 10, 30, 20 ]
        )
      }
    )

    it ( 'should insert null if value out of array', ( assert ) => {
        const a = [10,20]
        const b = 30
        assert.equal
        ( IM.insert ( a, 3, b )
        , [ 10, 20, null, 30 ]
        )
      }
    )

    it ( 'should replace null', ( assert ) => {
        const a = [10, null, 20]
        const b = 30
        assert.equal
        ( IM.insert ( a, 1, b )
        , [ 10, 30, 20 ]
        )
      }
    )


  }
)

describe ( 'IM.aset', ( it ) => {
    it ( 'should create new object', ( assert ) => {
        const a = [10]
        const b = 20
        assert.notSame
        ( IM.aset ( a, 0, b )
        , a
        )
      }
    )

    it ( 'should create frozen object', ( assert ) => {
        const a = IM.aset ( [0], 0, 1 )
        assert.throws
        ( function () {
            a[0] = 100
          }
        )
      }
    )

    it ( 'should set new value', ( assert ) => {
        const a = [10,20]
        const b = 30
        assert.equal
        ( IM.aset ( a, 1, b )
        , [ 10, 30 ] )
      }
    )

    it ( 'should not set outside array', ( assert ) => {
        assert.throws
        ( function () {
          const a = [10,20]
          const b = 30
          IM.aset ( a, 3, b )
          }
        )
      }
    )

    it ( 'should not set with neg indice', ( assert ) => {
        assert.throws
        ( function () {
          const a = [10,20]
          const b = 30
          IM.aset ( a, -1, b )
          }
        )
      }
    )
  }
)

describe ( 'IM.update', ( it ) => {
  const a = { x: { y: 1 }, z: 2 }
  const b = { b: 'b' }

    it ( 'should create new object', ( assert ) => {
        assert.notSame
        ( IM.update ( a, 'x', 'y', 3 )
        , a
        )
      }
    )

    it ( 'should create frozen object', ( assert ) => {
        const c = IM.update ( a, 'x', 'y', 3 )
        assert.throws
        ( function () {
            c.x.y = 4
          }
        )
      }
    )

    it ( 'should set new value', ( assert ) => {
        assert.equal
        ( IM.update ( a, 'x', 'y', 3 )
        , { x: { y: 3 }, z: 2 }
        )
      }
    )

    it ( 'should set new value with function', ( assert ) => {
        const a = { x: { y: { z: [ 1, 2 ] } }, w: 3 }
        const r =
        IM.update ( a, 'x', 'y', 'z'
        , ( z ) => {
            return IM.insert ( z, 1, 33 )
          }
        )
        assert.equal
        ( r
        , { x: { y: { z: [ 1, 33, 2 ] } }, w: 3 }
        )
      }
    )

    it ( 'should create required objects', ( assert ) => {
        const a = { x: { y: 1 }, z: 2 }
        assert.equal
        ( <any>IM.update ( a, 'x', 'z', 'w', 3 )
        , { x: { y: 1, z: { w: 3 } }, z: 2 }
        )
      }
    )
  }
)

describe ( 'IM.sort', ( it ) => {
    const comp = ( a, b ) => a < b ? -1 : 1
    const a = [3, 4, 2]
    it ( 'should create new object', ( assert ) => {
        assert.notSame
        ( IM.sort ( a, comp )
        , a
        )
      }
    )

    it ( 'should create frozen object', ( assert ) => {
        const o = IM.sort ( a, comp )
        assert.throws
        ( function () {
            o[0] = 12
          }
        )
      }
    )

    it ( 'should sort', ( assert ) => {
        assert.equal
        ( IM.sort ( a, comp )
        , [ 2, 3, 4 ]
        )
      }
    )
  }
)
