import { changesResults, mockComposition, mockRef } from './testUtils'
import { rangeSelection } from './rangeSelection'
import { extractSelection } from './extractSelection'

const composition = mockComposition ()
const position = { top: 0, left: 0 }

describe('extractSelection', () => {
  it ( 'extracts simple selection in plain paragraph', () => {
    mockRef ()
    const selection = rangeSelection
    ( ['zaahg'], 12
    , ['zaahg'], 17
    , position
    )
    expect
    ( changesResults
      ( extractSelection ( composition, selection ) )
    )
    .toEqual
    ( { selected: [ 'zaahg.refe2-T' ]
      , updated:
        [ 'zaahg-P'
        , 'zaahg.refe1-T'
        , 'zaahg.refe2-T'
        , 'zaahg.refe3-T'
        ]
      }
    )
  })

  it ( 'extracts selection accross markup', () => {
    mockRef ()
    const selection = rangeSelection
    ( [ 'zhaog', 'oiafg' ], 5
    , [ 'zhaog', 'haiou' ], 7
    , position
    )
    expect(changesResults(
      extractSelection ( composition, selection )
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

  it ( 'extracts single element fully selected', () => {
    mockRef ()
    const selection = rangeSelection
    ( [ 'zhaog', 'oaiue' ], 0
    , [ 'zhaog', 'oaiue' ], 7
    , position
    )
    expect
    ( changesResults
      ( extractSelection ( composition, selection ) )
    )
    .toEqual
    ( { selected: [ 'zhaog.oaiue-B' ]
      , updated: [ 'zhaog.oaiue-B' ]
      }
    )
  })
})
