/* global it expect describe */
import mockComposition from '../../mockComposition'
import isParagraphStart from './isParagraphStart'

const composition = mockComposition()

describe('isParagraphStart', () => {
  it('returns true for simple para start', () => {
    expect(
      isParagraphStart(composition, ['zaahg'], 0)
    )
    .toBe(true)
  })

  it('returns true for complex para start', () => {
    expect(
      isParagraphStart(composition, ['mcneu', 'uasuf'], 0)
    )
    .toBe(true)
  })

  it('returns false for offset greater then zero', () => {
    expect(
      isParagraphStart(composition, null, 1)
    )
    .toBe(false)
  })

  it('returns false for complex para start', () => {
    expect(
      isParagraphStart(composition, ['mcneu', 'jnaid', 'mnzjq'], 0)
    )
    .toBe(false)
  })
})
