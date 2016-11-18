/* global it expect describe jest */
import mockComposition from '../mockComposition'
import doSelect from './doSelect'

const composition = mockComposition()

describe('doSelect', () => {
  it('shows start of line toolbox', () => {
    const selection = {
      anchorPath: ['zaahg'],
      anchorOffset: 0,
      focusPath: ['zaahg'],
      focusOffset: 0
    }
    expect(
      doSelect(composition, selection)
    )
    .toEqual([
      {
        op: 'toolbox',
        value: {type: 'para'}
      }
    ])
  })
})
