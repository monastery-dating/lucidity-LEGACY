import { parse } from './parse'

import { source } from './test'

describe ( 'parse', () => {
  it ( 'should parse markdown', () => {
    const x = parse ( source ( 'testA.md' ) )
    expect
    ( x.fragments [ '@value.main' ].source
    )
    .toEqual
    ( 'const v = 2\nreturn v' )

    expect
    ( Object.keys ( x.fragments )
      .sort ()
    )
    .toEqual
    ( [ '$addid.source'
      , '$fooid.source'
      , '$value1id.source'
      , '$value2id.source'
      , '@value.main'
      ]
    )
  })
})