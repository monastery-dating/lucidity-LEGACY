/* global it expect describe */
import mockComposition from '../mockComposition'
import doSelect from './doSelect'

const composition = mockComposition()

describe('doSelect', () => {
  it('shows start of line toolbox', () => {
    const selection = {
      anchorPath: ['zaahg'],
      anchorOffset: 0,
      focusPath: ['zaahg'],
      focusOffset: 0,
      type: 'Caret',
      end: {}
    }
    expect(
      doSelect(composition, selection)
    )
    .toEqual([
      {
        op: 'toolbox',
        value: {type: 'Paragraph', position: {}}
      }
    ])
  })

  it('shows select toolbox', () => {
    const selection = {
      anchorPath: ['mcneu', 'jnaid', 'zzvgp'],
      anchorOffset: 0,
      focusPath: ['mcneu', 'jnaid', 'zzvgp'],
      focusOffset: 4,
      type: 'Range',
      position: {}
    }
    expect(
      doSelect(composition, selection)
    )
    .toEqual([
      {
        op: 'toolbox',
        value: {type: 'Select'}
      }
    ])
  })
})
