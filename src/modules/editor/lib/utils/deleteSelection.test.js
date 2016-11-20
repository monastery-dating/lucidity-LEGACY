/* global it expect describe */
import {mockComposition} from './testUtils'
import deleteSelection from './deleteSelection'

const composition = mockComposition()

describe('deleteSelection', () => {
  it('removes selected text in simple selection', () => {
    const selection = {
      anchorPath: ['zhaog', 'oaiue'],
      anchorOffset: 1,
      focusPath: ['zhaog', 'oaiue'],
      focusOffset: 4
    }
    expect(
      deleteSelection(composition, selection)
    )
    .toEqual([
      {
        op: 'update', path: ['zhaog', 'oaiue'],
        value: {p: 1, t: 'B', i: 'mage'}
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
      deleteSelection(composition, selection)
    )
    .toEqual([
      {
        op: 'update', path: ['mcneu', 'jnaid', 'zzvgp'],
        value: {p: 1, t: 'B+I', i: 'li'}
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
        value: {p: 2, t: 'T', i: 'ragraph. My tailor types fast.'}
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
      deleteSelection(composition, selection)
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
        value: {p: 2, t: 'T', i: 'to view the third paragraph. My tailor types fast.'}
      },
      { op: 'delete', path: ['zaahg'] }
    ])
  })

  it('merge elements in local selection accross markup with fuse', () => {
    const selection = {
      anchorPath: ['zhaog', 'oiafg'],
      anchorOffset: 12,
      focusPath: ['zhaog', 'haiou'],
      focusOffset: 13
    }
    expect(
      deleteSelection(composition, selection)
    )
    .toEqual([
      {
        op: 'update', path: ['zhaog'],
        value: {p: 1, t: 'P', i: 'This is the bomgolo frabilou elma tec.'}
      },
      {
        op: 'select', path: ['zhaog'],
        offset: 12
      }
    ])
  })

  it('wide selection two levels deep without fuse', () => {
    const selection = {
      anchorPath: ['zhaog', 'oaiue'],
      anchorOffset: 3,
      focusPath: ['zaahg'],
      focusOffset: 32
    }
    expect(
      deleteSelection(composition, selection)
    )
    .toEqual([
      {
        op: 'update', path: ['zhaog', 'oaiue'],
        value: {p: 1, t: 'B', i: 'mes'}
      },
      { // Could be select in zhaog.zaahg (check what is expected)
        op: 'select', path: ['zhaog', 'oaiue'],
        offset: 3
      },
      { op: 'delete', path: ['zhaog', 'haiou'] },
      {
        op: 'update', path: ['zhaog', 'zaahg'],
        value: {p: 2, t: 'T', i: 'tailor types fast.'}
      },
      { op: 'delete', path: ['zaahg'] }
    ])
  })

  it('wide selection three levels deep without fuse', () => {
    const selection = {
      anchorPath: ['mcneu', 'jnaid', 'zzvgp'],
      anchorOffset: 2,
      focusPath: ['zhaog', 'haiou'],
      focusOffset: 35
    }
    expect(
      deleteSelection(composition, selection)
    )
    .toEqual([
      {
        op: 'update', path: ['mcneu', 'jnaid', 'zzvgp'],
        value: {p: 1, t: 'B+I', i: 'li'}
      },
      {
        op: 'select', path: ['mcneu', 'jnaid', 'zzvgp'],
        offset: 2
      },
      { op: 'delete', path: ['mcneu', 'mznao'] },
      { op: 'delete', path: ['mcneu', 'mnahl'] },
      { op: 'delete', path: ['mcneu', 'ncgow'] },
      { op: 'delete', path: ['zhaog', 'oiafg'] },
      { op: 'delete', path: ['zhaog', 'oaiue'] },
      {
        op: 'update', path: ['mcneu', 'haiou'],
        value: {p: 2, t: 'T', i: 'tec.'}
      },
      { op: 'delete', path: ['zhaog'] }
    ])
  })
})
