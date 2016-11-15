/* global it expect describe */
import mockComposition from '../mockComposition'
import getSiblings from './getSiblings'

const composition = mockComposition()

describe('getSiblings', () => {
  it('finds siblings at root level', () => {
    const path = ['zhaog']
    expect(
      getSiblings(composition, path).map(e => e.path)
    )
    .toEqual([
      ['mcneu'],
      ['zaahg']
    ])
  })

  it('finds next sibling across levels', () => {
    const path = ['mcneu', 'jnaid', 'zzvgp']
    expect(
      getSiblings(composition, path).map(e => e.path)
    )
    .toEqual([
      ['mcneu', 'jnaid', 'mnzjq'],
      ['mcneu', 'mznao']
    ])
  })

  it('finds prev sibling across levels', () => {
    const path = ['mcneu', 'jnaid', 'mnzjq']
    expect(
      getSiblings(composition, path).map(e => e.path)
    )
    .toEqual([
      ['mcneu', 'uasuf'],
      ['mcneu', 'jnaid', 'zzvgp']
    ])
  })
})
