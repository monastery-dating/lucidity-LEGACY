/// <reference path="../../typings/jasmine/jasmine.d.ts" />
import { merge } from './merge.util'

describe
( 'merge utility', () => {
    it ( 'should create new object'
    , () => {
        const a = {}
        const b = {}
        expect ( merge ( a, b ) )
        .not.toBe ( a )
        expect ( merge ( a, b ) )
        .not.toBe ( b )
      }
    )

    it ( 'should merge new values'
    , () => {
        const a = { a: 3 }
        const b = { x: 1 }
        expect ( merge ( a, b ) )
        .toEqual ( { a: 3, x: 1 } )
      }
    )

    it ( 'should replace values'
    , () => {
        const a = { a: 3, x: 3 }
        const b = { x: 1 }
        expect ( merge ( a, b ) )
        .toEqual ( { a: 3, x: 1 } )
      }
    )

    it ( 'should delete null values'
    , () => {
        const a = { a: 3, b: 4 }
        const b = { b: null }
        expect ( merge ( a, b ) )
        .toEqual ( { a: 3 } )
      }
    )
  }
)
