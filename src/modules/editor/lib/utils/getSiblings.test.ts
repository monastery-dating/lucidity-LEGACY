/* global it expect describe */
import { mockComposition } from './testUtils'
import { getSiblings } from './getSiblings'

const composition = mockComposition()

describe('getSiblings', () => {
  it('return null for last element in parent', () => {
    const path = [ 'zhaog', 'haiou' ]
    expect
    ( getSiblings ( composition, path ).map ( e => e && e.path || null )
    )
    .toEqual
    ( [ [ 'zhaog', 'oaiue' ]
      , null
      ]
    )
  })
})
