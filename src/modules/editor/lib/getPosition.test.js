/* global it expect describe */
import mockComposition from '../mockComposition'
import getPosition from './getPosition'

const composition = mockComposition()

describe('getPosition', () => {
  it('converts path into position', () => {
    const path = ['zaahg']
    expect(getPosition(composition, path))
    .toEqual([2.0])
  })

  it('converts nested path into position', () => {
    const path = ['mcneu', 'jnaid', 'zzvgp']
    expect(getPosition(composition, path))
    .toEqual([0.0, 1.0, 1.0])
  })
})
