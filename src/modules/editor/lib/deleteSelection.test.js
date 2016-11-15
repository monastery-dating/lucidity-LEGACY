/* global it expect describe */
import mockComposition from '../mockComposition'
import deleteSelection from './deleteSelection'

const composition = mockComposition()

describe('deleteSelection', () => {
  it('returns set of operations inside single text', () => {
    const selection = {
      anchorPath: 'zhaog.i.oaiue',
      anchorOffset: 1,
      focusPath: 'zhaog.i.oaiue',
      focusOffset: 4
    }
    expect(
      deleteSelection(composition, selection)
    )
    .toEqual([
      {
        op: 'update', path: 'zhaog.i.oaiue',
        value: {p: 1, t: 'S', i: 'mage'}
      }
    ])
  })

  it('returns set of operations accross paragraph', () => {
    const selection = {
      anchorPath: 'mcneu.i.jnaid.i.zzvgp',
      anchorOffset: 2,
      focusPath: 'zaahg',
      focusOffset: 20
    }
    expect(
      deleteSelection(composition, selection)
    )
    .toEqual([
      {
        op: 'update', path: 'mcneu.i.jnaid.i.zzvgp',
        value: {p: 1, t: 'S+E', i: 'li'}
      },
      { op: 'remove', path: 'mcneu.i.mznao' },
      { op: 'remove', path: 'mcneu.i.mnahl' },
      { op: 'remove', path: 'mcneu.i.ncgow' },
      { op: 'remove', path: 'zhaog' },
      {
        op: 'update', path: 'zaahg',
        value: {p: 2, t: 'P', i: 'ragraph. Hello blah bomgolo frabilou elma tec.'}
      }
    ])
  })
})
