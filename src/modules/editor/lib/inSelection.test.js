/* global it expect describe */
import mockComposition from '../mockComposition'
import inSelection from './inSelection'

const composition = mockComposition()

describe('inSelection', () => {
  it('extracts selected elements', () => {
    const selection = {
      anchorPath: ['mcneu', 'jnaid', 'zzvgp'],
      anchorOffset: 2,
      focusPath: ['zaahg'],
      focusOffset: 20
    }
    expect(
      inSelection(composition, selection).map(e => e.path.join('.'))
    )
    .toEqual([
      'mcneu.jnaid.zzvgp',
      'mcneu.mznao',
      'mcneu.mnahl',
      'mcneu.ncgow',
      'zhaog',
      'zaahg'
    ])
  })

  it('extracts selected elements in local selection accross markup', () => {
    const selection = {
      anchorPath: ['zhaog', 'oiafg'],
      anchorOffset: 12,
      focusPath: ['zhaog', 'haiou'],
      focusOffset: 13
    }
    expect(
      inSelection(composition, selection).map(e => e.path.join('.'))
    )
    .toEqual([
      'zhaog.oiafg',
      'zhaog.oaiue',
      'zhaog.haiou'
    ])
  })
})
