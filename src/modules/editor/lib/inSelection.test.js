/* global it expect describe */
import mockComposition from '../mockComposition'
import inSelection from './inSelection'

const composition = mockComposition()
const selection = {
  anchorPath: ['mcneu', 'jnaid', 'zzvgp'],
  anchorOffset: 2,
  focusPath: ['zaahg'],
  focusOffset: 20
}

describe('inSelection', () => {
  it('extracts selected elements', () => {
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
})
