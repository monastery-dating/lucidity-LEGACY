/* global it expect describe */
import { simplifyChildren } from './simplify'

describe ( 'resetPosition', () => {
  it ( 'resets positions', () => {
    const children =
    { foo: { p: 1, t: 'T', i: '' }
    , bar: { p: 1.25, t: 'T', i: '' }
    , baz: { p: 3, t: 'T', i: '' }
    }
    expect
    ( simplifyChildren ( children ) )
    .toEqual
    ( { foo: { p: 0 }
      , bar: { p: 1 }
      , baz: { p: 2 }
      }
    )
  })
})
