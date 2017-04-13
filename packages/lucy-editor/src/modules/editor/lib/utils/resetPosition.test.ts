/* global it expect describe */
import { resetPosition } from './resetPosition'

describe ( 'resetPosition', () => {
  it ( 'resets positions', () => {
    const children =
    { foo: { p: 1 }
    , bar: { p: 1.25 }
    , baz: { p: 3 }
    }
    expect
    ( resetPosition ( children ) )
    .toEqual
    ( { foo: { p: 0 }
      , bar: { p: 1 }
      , baz: { p: 2 }
      }
    )
  })
})
