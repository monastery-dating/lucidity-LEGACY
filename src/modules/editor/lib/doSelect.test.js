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
      type: 'Range'
    }
    expect(
      doSelect(composition, selection)
    )
    .toEqual([
      {
        op: 'toolbox',
        value: {type: 'Paragraph'}
      }
    ])
  })
})
