import { changesResults, mockComposition, mockRef } from './testUtils'
import { applyOp } from './applyOp'
import { rangeSelection } from './rangeSelection'
import { extractSelection } from './extractSelection'

const composition = mockComposition ()
const position = { top: 0, left: 0 }

describe ( 'applyOp', () => {
  it ( 'extracts simple selection in plain paragraph', () => {
    mockRef ()
    const selection = rangeSelection
    ( ['zaahg'], 12
    , ['zaahg'], 17
    , position
    )
    const changes = extractSelection ( composition, selection )
    expect
    ( changesResults
      ( applyOp ( composition, changes, 'B' ) )
    )
    .toEqual
    ( { selected: [ 'zaahg.refe2-B' ]
      , updated:
        [ 'zaahg-P'
        , 'zaahg.refe1-T'
        , 'zaahg.refe2-B'
        , 'zaahg.refe3-T'
        ]
      , deleted: []
      }
    )
  })
})
