/* global it expect describe */
import mockComposition from '../mockComposition'
import inSelection from './inSelection'

const composition = mockComposition()
const selection = {
  anchorPath: 'mcneu.i.jnaid.i.zzvgp',
  anchorOffset: 2,
  focusPath: 'zaahg',
  focusOffset: 20
}

describe('inSelection', () => {
  it('extracts selected elements', () => {
    expect(inSelection(composition, selection).map(e => e.path))
    .toEqual([
      'mcneu.i.jnaid.i.zzvgp',
      'mcneu.i.mznao',
      'mcneu.i.mnahl',
      'mcneu.i.ncgow',
      'zhaog',
      'zaahg'
    ])
  })
})
