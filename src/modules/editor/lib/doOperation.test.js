/* global jest it expect describe */
import {rangeSelection, mockComposition} from './utils/testUtils.js'
import doOperation from './doOperation'
import applyB from './utils/applyB'

const composition = mockComposition()

let counter = 0
jest.mock('./utils/makeRef', () => {
  return jest.fn(() => `refe${++counter}`)
})

describe('doOperation.B', () => {
  it('should apply B', () => {
    counter = 0
    const selection = rangeSelection(
      ['zaahg'], 12,
      ['zaahg'], 17
    )
    const ops = applyB(composition, selection)
    counter = 0
    expect(
      doOperation('B', composition, selection)
    )
    .toEqual(ops)
  })
})
