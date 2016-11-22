/* global jest it expect describe */
import {rangeSelection, mockComposition} from './utils/testUtils.js'
import doOperation from './doOperation'

const composition = mockComposition()

let counter = 0
jest.mock('./utils/makeRef', () => {
  return jest.fn(() => `refe${++counter}`)
})

describe('doOperation.B', () => {
  it('renders bold selection', () => {
    counter = 0
    const selection = rangeSelection(
      ['zaahg'], 12,
      ['zaahg'], 17
    )
    expect(
      doOperation(composition, selection, 'B')
    )
    .toEqual([
      {
        op: 'update',
        path: ['zaahg'],
        value: {t: 'P', p: 2, i: {
          refe1: {t: 'T', p: 0, i: 'This is the '},
          refe2: {t: 'B', p: 1, i: 'third'},
          refe3: {t: 'T', p: 2, i: ' paragraph. My tailor types fast.'}
        }}
      }
    ])
  })

  it('XX renders larger bold selection', () => {
    counter = 0
    const selection = rangeSelection(
      ['zhaog', 'oiafg'], 5,
      ['zhaog', 'haiou'], 7
    )
    expect(
      doOperation(composition, selection, 'B')
    )
    .toEqual([
      {
        op: 'update',
        path: ['zhaog'],
        value: {t: 'P', p: 1, i: {
          oiafg: {t: 'T', p: 0, i: 'This '},
          oaiue: {t: 'B', p: 1, i: 'is the first message. Hello'},
          haiou: {t: 'T', p: 2, i: ' blah bomgolo frabilou elma tec.'}
        }}
      }
    ])
  })
})
