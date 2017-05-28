import { isTextBlock } from './isTextBlock'
import { mockComposition } from './testUtils'

const composition = mockComposition ()

describe ( 'isTextBlock', () => {
  it ( 'returns true for raw paragraphs', () => {
    expect
    ( [ { t: 'P', p: 0, i: 'Some text' }
      , { t: 'T', p: 0, i: 'Some text' }
      , { t: 'H', p: 0, i: 'Some text', o: { h: 1 } }
      , { t: 'B', p: 0, i: 'Some text' }
      ]
      .map ( isTextBlock )
    )
    .toEqual
    ( [ true
      , true
      , true
      , true
      ]
    )
  })

  it ( 'returns false for non-text blocks', () => {
    expect
    ( [ { t: 'A', p: 0, i: 'Some text', o: { href: 'xxx' } }
      , { t: 'P', p: 0, i: {} }
      , { t: 'H', p: 0, i: {}, o: { h: 1 } }
      ]
      .map ( isTextBlock )
    )
    .toEqual
    ( [ false
      , false
      , false
      ]
    )
  })
})
