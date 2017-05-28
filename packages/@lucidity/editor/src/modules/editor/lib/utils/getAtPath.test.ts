/* global it expect describe */
import { mockComposition } from './testUtils'
import { getAtPath } from './getAtPath'

const composition = mockComposition ()

describe('getAtPath', () => {
  it('gets element in root', () => {
    expect
    ( getAtPath ( composition, [ 'zaahg' ] ) )
    .toBe
    ( composition.i [ 'zaahg' ] )
  })

  it('gets element in root', () => {
    expect
    ( getAtPath ( composition, [ 'mcneu', 'uasuf', 'jnaid' ] ) )
    .toBe
    ( composition.i [ 'mcneu' ].i [ 'uasuf' ].i [ 'jnaid' ] )
  })

  it('gets root element', () => {
    expect
    ( getAtPath ( composition, [] ) )
    .toBe
    ( composition )
  })
})
