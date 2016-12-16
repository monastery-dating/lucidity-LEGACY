/* global jest it expect describe */
import {mockComposition} from './testUtils'
import rangeSelection from './rangeSelection'
import extractSelection from './extractSelection'

const composition = mockComposition()

let counter = 0
jest.mock('./makeRef', () => {
  return jest.fn(() => `refe${++counter}`)
})

const pathTypes = ({selected, updated}) => ({
  selected: selected.map(s => s.path.join('.') + '-' + s.elem.t),
  updated: updated.map(s => s.path.join('.') + '-' + s.elem.t)
})

describe('extractSelection', () => {
  it('extracts simple selection in plain paragraph', () => {
    counter = 0
    const selection = rangeSelection(
      ['zaahg'], 12,
      ['zaahg'], 17
    )
    expect(pathTypes(
      extractSelection(composition, selection)
    ))
    .toEqual({
      selected: ['zaahg.refe2-T'],
      updated: [
        'zaahg-P',
        'zaahg.refe1-T',
        'zaahg.refe2-T',
        'zaahg.refe3-T'
      ]
    })
  })

  it('extracts selection accross markup', () => {
    counter = 0
    const selection = rangeSelection(
      ['zhaog', 'oiafg'], 5,
      ['zhaog', 'haiou'], 7
    )
    expect(pathTypes(
      extractSelection(composition, selection)
    ))
    .toEqual({
      selected: ['zhaog.refe1-T', 'zhaog.oaiue-B', 'zhaog.refe2-T'],
      updated: [
        'zhaog.oiafg-T',
        'zhaog.refe1-T',
        'zhaog.oaiue-B',
        'zhaog.refe2-T',
        'zhaog.haiou-T'
      ]
    })
  })

  it('extracts single element fully selected', () => {
    counter = 0
    const selection = rangeSelection(
      ['zhaog', 'oaiue'], 0,
      ['zhaog', 'oaiue'], 7
    )
    expect(pathTypes(
      extractSelection(composition, selection)
    ))
    .toEqual({
      selected: ['zhaog.oaiue-B'],
      updated: ['zhaog.oaiue-B']
    })
  })
})
