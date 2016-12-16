/* global it expect describe */
import {mockComposition} from './testUtils'
import isTextBlock from './isTextBlock'

const composition = mockComposition()

describe('isTextBlock', () => {
  it('returns true for text blocks', () => {
    expect(isTextBlock(composition.i.mcneu.i.uasuf))
    .toBe(true)
    expect(isTextBlock(composition.i.zaahg))
    .toBe(true)
  })

  it('returns false for non-text blocks', () => {
    expect(isTextBlock(composition.i.mcneu.i.jnaid))
    .toBe(false)
    expect(isTextBlock(composition.i.mcneu))
    .toBe(false)
  })
})
