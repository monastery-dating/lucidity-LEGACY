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
      },
      {
        op: 'select', path: ['zhaog', 'oaiue'],
        offset: 1
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
      },
      {
        op: 'select', path: ['zhaog', 'oaiue'],
        offset: 1
      }
    ])
  })

  it('merge elements in wide selection without fuse', () => {
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
      {
        op: 'select', path: ['mcneu', 'jnaid', 'zzvgp'],
        offset: 2
      },
      { op: 'delete', path: ['mcneu', 'mznao'] },
      { op: 'delete', path: ['mcneu', 'mnahl'] },
      { op: 'delete', path: ['mcneu', 'ncgow'] },
      { op: 'delete', path: ['zhaog'] },
      {
        op: 'update', path: ['mcneu', 'zaahg'],
        value: {p: 2, t: 'P', i: 'ragraph. Hello blah bomgolo frabilou elma tec.'}
      },
      { op: 'delete', path: ['zaahg'] }
    ])
  })

  it('merge elements in wide selection with fuse', () => {
    const selection = {
      anchorPath: ['mcneu', 'mznao'],
      anchorOffset: 8,
      focusPath: ['zaahg'],
      focusOffset: 8
    }
    expect(
      keyBackspace(composition, selection)
    )
    .toEqual([
      {
        op: 'select', path: ['mcneu', 'mznao'],
        offset: 8
      },
      { op: 'delete', path: ['mcneu', 'mnahl'] },
      { op: 'delete', path: ['mcneu', 'ncgow'] },
      { op: 'delete', path: ['zhaog'] },
      {
        op: 'update', path: ['mcneu', 'mznao'],
        value: {p: 2, t: 'T', i: 'to view the third paragraph. Hello blah bomgolo frabilou elma tec.'}
      },
      { op: 'delete', path: ['zaahg'] }
    ])
  })
})
