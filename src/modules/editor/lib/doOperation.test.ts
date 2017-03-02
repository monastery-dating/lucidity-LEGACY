/* global jest it expect describe */
import { mockComposition } from './utils/testUtils.js'
import { rangeSelection } from './utils/rangeSelection'
import { doOperation } from './doOperation'

const composition = mockComposition ()
const position = { top: 0, left: 0 }

let counter = 0
jest.mock('./utils/makeRef', () => {
  return jest.fn(() => `refe${++counter}`)
})

describe('doOperation.B', () => {
  it('renders bold selection', () => {
    counter = 0
    const selection = rangeSelection
    ( [ 'zaahg' ], 12
    , [ 'zaahg' ], 17
    , position
    )
    expect
    ( doOperation ( composition, selection, 'B' ) )
    .toEqual
    ( [ { op: 'update'
        , path: [ 'zaahg' ]
        , value: { t: 'P', p: 2, i: {} }
        }
      , { op: 'update'
        , path: [ 'zaahg', 'refe1' ]
        , value: { t: 'T', p: 0, i: 'This is the ' }
        }
      , { op: 'update'
        , path: [ 'zaahg', 'refe2' ]
        , value: { t: 'B', p: 1, i: 'third' }
        }
      , { op: 'update'
        , path: [ 'zaahg', 'refe3' ]
        , value: { t: 'T', p: 2, i: ' paragraph. My tailor types fast.' }
        }
      , { op: 'select'
        , value: rangeSelection
          ( [ 'zaahg', 'refe2' ], 0
          , [ 'zaahg', 'refe2' ], 5
          , position
          )
        }
      ]
    )
  })

  it('renders larger bold selection', () => {
    counter = 0
    const selection = rangeSelection
    ( [ 'zhaog', 'oiafg' ], 5
    , [ 'zhaog', 'haiou' ], 7
    , position
    )
    expect
    ( doOperation ( composition, selection, 'B' )
    )
    .toEqual
    ( [ { op: 'update'
        , path: [ 'zhaog', 'oiafg' ]
        , value: { t: 'T', p: 0, i: 'This ' }
        }
      , { op: 'update'
        , path: [ 'zhaog', 'oaiue' ]
        , value: { t: 'B', p: 1, i: 'is the first message. Hello' }
        }
      , { op: 'update'
        , path: [ 'zhaog', 'haiou' ]
        , value: { t: 'T', p: 2, i: ' blah bomgolo frabilou elma tec.' }
        }
      , { op: 'select'
        , value: rangeSelection
          ( [ 'zhaog', 'oaiue' ], 0
          , [ 'zhaog', 'oaiue' ], 27
          , position
          )
        }
      ]
    )
  })

  it('renders bold selection after other markup', () => {
    counter = 0
    const selection = rangeSelection
    ( [ 'zhaog', 'haiou' ], 13
    , [ 'zhaog', 'haiou' ], 20
    , position
    )
    expect
    ( doOperation ( composition, selection, 'B' )
    )
    .toEqual
    ( [ { op: 'update'
        , path: [ 'zhaog', 'oiafg' ]
        , value: { t: 'T', p: 0, i: 'This is the first ' }
        }
      , { op: 'update'
        , path: [ 'zhaog', 'oaiue' ]
        , value: { t: 'B', p: 1, i: 'message' }
        }
      , { op: 'update'
        , path: [ 'zhaog', 'haiou' ]
        , value: { t: 'T', p: 2, i: '. Hello blah ' }
        }
      , { op: 'update'
        , path: [ 'zhaog', 'refe1' ]
        , value: { t: 'B', p: 3, i: 'bomgolo' }
        }
      , { op: 'update'
        , path: [ 'zhaog', 'refe2' ]
        , value: { t: 'T', p: 4, i: ' frabilou elma tec.' }
        }
      , { op: 'select'
        , value: rangeSelection
          ( [ 'zhaog', 'refe1' ], 0
          , [ 'zhaog', 'refe1' ], 7
          , position
          )
        }
      ]
    )
  })
})
