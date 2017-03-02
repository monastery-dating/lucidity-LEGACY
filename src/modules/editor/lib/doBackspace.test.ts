/* global it expect describe */
import { mockComposition } from './utils/testUtils.js'
import { caretSelection } from './utils/caretSelection'
import { doBackspace } from './doBackspace'
import { SelectionPositionType } from './utils/types'

const composition = mockComposition()
const pos: SelectionPositionType = { top: 0, left: 0 }

describe('doBackspace', () => {
  it('removes last character', () => {
    const selection = caretSelection ( [ 'zhaog', 'oaiue' ], 2, pos )
    expect
    ( doBackspace ( composition, selection ) )
    .toEqual
    ( [ { op: 'update', path: [ 'zhaog', 'oaiue' ]
        , value: { p: 1, t: 'B', i: 'mssage' }
        }
      , { op: 'select'
        , value: caretSelection ( [ 'zhaog', 'oaiue' ], 1, pos )
      }
    ])
  })

  it('merges with previous paragraph at start of line', () => {
    const selection = caretSelection(['zhaog', 'oiafg'], 0, pos )
    expect(
      doBackspace(composition, selection)
    )
    .toEqual([
      {
        op: 'update', path: ['mcneu', 'ncgow'],
        value: {p: 4, t: 'T', i: '.This is the first '}
      },
      {
        op: 'select',
        value: caretSelection(['mcneu', 'ncgow'], 1, pos)
      },
      {
        op: 'update', path: ['mcneu', 'oaiue'],
        value: {p: 5, t: 'B', i: 'message'}
      },
      {
        op: 'update', path: ['mcneu', 'haiou'],
        value: {p: 6, t: 'T', i: '. Hello blah bomgolo frabilou elma tec.'}
      },
      {op: 'delete', path: ['zhaog']}
    ])
  })

  it('merges and fuse with previous complex paragraph at start of line', () => {
    const selection = caretSelection(['zaahg'], 0, pos)
    expect(
      doBackspace(composition, selection)
    )
    .toEqual([
      {
        op: 'update', path: ['zhaog', 'haiou'],
        value: {p: 2, t: 'T', i: '. Hello blah bomgolo frabilou elma tec.This is the third paragraph. My tailor types fast.'}
      },
      {
        op: 'select',
        value: caretSelection(['zhaog', 'haiou'], 39, pos)
      },
      {op: 'delete', path: ['zaahg']}
    ])
  })

  it('merges with previous complex paragraph at start of line', () => {
    const selection = caretSelection(['zaahg'], 0, pos)
    const composition = mockComposition()
    composition.i [ 'zhaog' ].i[ 'haiou' ].t = 'B+I'
    expect(
      doBackspace(composition, selection)
    )
    .toEqual([
      {
        op: 'update', path: ['zhaog', 'zaahg'],
        value: {p: 3, t: 'T', i: 'This is the third paragraph. My tailor types fast.'}
      },
      {
        op: 'select',
        value: caretSelection(['zhaog', 'zaahg'], 0, pos)
      },
      {op: 'delete', path: ['zaahg']}
    ])
  })
})
