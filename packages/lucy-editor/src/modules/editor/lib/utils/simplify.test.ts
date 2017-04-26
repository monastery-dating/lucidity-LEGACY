import { applyOp } from './applyOp'
import { extractSelection } from './extractSelection'
import { rangeSelection } from './rangeSelection'
import { simplify } from './simplify'
import { changesResults, mockComposition, mockRef } from './testUtils'

const composition = mockComposition ()
const position = { top: 0, left: 0 }

describe ( 'simplify', () => {
  it ( 'merges same elements', () => {
    const selection = rangeSelection
    ( [ 'zhaog', 'oaiue' ], 0
    , [ 'zhaog', 'oaiue' ], 7
    , position
    )
    const rawChanges = applyOp
    ( composition
    , extractSelection ( composition, selection )
    , 'B'
    )

    const simplified = simplify ( composition, rawChanges )
    expect
    ( changesResults
      ( simplified
      ).updated
    )
    .toEqual
    ( [ 'zhaog-P' ]
    )

    expect
    ( simplified.elements [ 'zhaog' ].elem.i
    )
    .toEqual
    // All fused in parent
    ( 'This is the first message. Hello blah bomgolo frabilou elma tec.'
    )
  })
})
