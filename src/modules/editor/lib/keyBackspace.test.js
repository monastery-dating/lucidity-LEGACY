/* global it expect describe */
import mockComposition from '../mockComposition'
import keyBackspace from './keyBackspace'

const composition = mockComposition()

describe('keyBackspace', () => {
  it('removes last character', () => {
    const selection = {
      anchorPath: ['zhaog', 'oaiue'],
      anchorOffset: 2,
      focusPath: ['zhaog', 'oaiue'],
      focusOffset: 2
    }
    expect(
      keyBackspace(composition, selection)
    )
    .toEqual([
      {
        op: 'update', path: ['zhaog', 'oaiue'],
        value: {p: 1, t: 'S', i: 'mssage'}
      }
    ])
  })

  it('removes selected text in simple selection', () => {
    const selection = {
      anchorPath: ['zhaog', 'oaiue'],
      anchorOffset: 1,
      focusPath: ['zhaog', 'oaiue'],
      focusOffset: 4
    }
    expect(
      keyBackspace(composition, selection)
    )
    .toEqual([
      {
        op: 'update', path: ['zhaog', 'oaiue'],
        value: {p: 1, t: 'S', i: 'mage'}
      }
    ])
  })

  it('removes selected elements in wide selection', () => {
    const selection = {
      anchorPath: ['mcneu', 'jnaid', 'zzvgp'],
      anchorOffset: 2,
      focusPath: ['zaahg'],
      focusOffset: 20
    }
    expect(
      keyBackspace(composition, selection)
    )
    .toEqual([
      {
        op: 'update', path: ['mcneu', 'jnaid', 'zzvgp'],
        value: {p: 1, t: 'S+E', i: 'li'}
      },
      { op: 'remove', path: ['mcneu', 'mznao'] },
      { op: 'remove', path: ['mcneu', 'mnahl'] },
      { op: 'remove', path: ['mcneu', 'ncgow'] },
      { op: 'remove', path: ['zhaog'] },
      {
        op: 'update', path: ['zaahg'],
        value: {p: 2, t: 'P', i: 'ragraph. Hello blah bomgolo frabilou elma tec.'}
      }
    ])
  })
})
