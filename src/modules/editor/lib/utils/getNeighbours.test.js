/* global it expect describe */
import mockComposition from '../../mockComposition'
import getNeighbours from './getNeighbours'

const composition = mockComposition()

describe('getNeighbours', () => {
  it('finds neighbours at root level', () => {
    const path = ['zhaog']
    expect(
      getNeighbours(composition, path).map(e => e.path)
    )
    .toEqual([
      ['mcneu', 'ncgow'],
      ['zaahg']
    ])
  })

  it('finds next neighbour across levels', () => {
    const path = ['mcneu', 'jnaid', 'zzvgp']
    expect(
      getNeighbours(composition, path).map(e => e.path)
    )
    .toEqual([
      ['mcneu', 'jnaid', 'mnzjq'],
      ['mcneu', 'mznao']
    ])
  })

  it('finds prev neighbour across levels', () => {
    const path = ['mcneu', 'jnaid', 'mnzjq']
    expect(
      getNeighbours(composition, path).map(e => e.path)
    )
    .toEqual([
      ['mcneu', 'uasuf'],
      ['mcneu', 'jnaid', 'zzvgp']
    ])
  })

  it('finds prev neighbour up across levels', () => {
    const path = ['zaahg']
    expect(
      getNeighbours(composition, path).map(e => e && e.path)
    )
    .toEqual([
      ['zhaog', 'haiou'],
      undefined
    ])
  })
})
