/* global it expect describe */
import stripZeroWidthChar from './stripZeroWidthChar'

describe('stripZeroWidthChar', () => {
  it('does not alter text without zero width char', () => {
    expect(stripZeroWidthChar('some text', {}))
    .toEqual({value: 'some text'})
  })

  it('remove zero width char and update selection', () => {
    const selection = {
      anchorOffset: 3
    }
    expect(stripZeroWidthChar('\u200Bfoobar', selection))
    .toEqual(
      {
        value: 'foobar',
        selection: {anchorOffset: 2, focusOffset: 2}
      }
    )
  })

  it('remove zero width char and does not update selection', () => {
    const selection = {
      anchorOffset: 3
    }
    expect(stripZeroWidthChar('hello \u200Bfoobar', selection))
    .toEqual(
      {
        value: 'hello foobar',
        selection
      }
    )
  })
})
