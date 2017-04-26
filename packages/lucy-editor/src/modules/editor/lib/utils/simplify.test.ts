import { applyOp } from './applyOp'
import { extractSelection } from './extractSelection'
import { rangeSelection } from './rangeSelection'
import { simplify } from './simplify'
import { mockComposition, mockRef } from './testUtils'

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

    const changes = simplify ( composition, rawChanges )
    expect
    ( changes.updated.map
      ( re => re.path.join ( '.' ) + '-' + re.elem.t )
    )
    .toEqual
    ( [ 'zhaog-T' ]
    )
  })
})
