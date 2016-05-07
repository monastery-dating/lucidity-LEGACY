/// <reference path="../../typings/jasmine/jasmine.d.ts" />
import { gettype } from './gettype.util'

describe
( 'gettype utility', () => {
    it ( 'should return a typeinfo object'
    , () => {
        const res = gettype ( SOURCE_A )
        expect ( typeof res )
        .toBe ( 'object' )
      }
    )
  }
)

// ============================================= Source code for testing
const SOURCE_A = ``
