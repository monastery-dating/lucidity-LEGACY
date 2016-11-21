/* global jest it expect describe */
import {mockComposition, rangeSelection} from './testUtils'
import extractSelection from './extractSelection'

const composition = mockComposition()

let counter = 0
jest.mock('./makeRef', () => {
  return jest.fn(() => `refe${++counter}`)
})

const paths = children => {
  if (typeof children === 'string') {
    return ''
  } else {
    return ' ' + Object.keys(children).sort((a, b) => children[a].p > children[b].p ? 1 : -1).join('/')
  }
}

const pathTypes = ({selected, updated}) => ({
  selected: selected.map(s => s.path.join('.') + '-' + s.elem.t + paths(s.elem.i)),
  updated: updated.map(s => s.path.join('.') + '-' + s.elem.t + paths(s.elem.i))
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
      updated: ['zaahg-P refe1/refe2/refe3']
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
      updated: ['zhaog-P oiafg/refe1/oaiue/refe2/haiou']
    })
  })
})
