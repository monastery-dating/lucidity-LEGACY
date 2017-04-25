import { fragmentInfo } from './extractSources'

describe ( 'fragmentInfo', () => {
  it ( 'should parse single ts line', () => {
    expect
    ( [ '   // <frag:foobar>  '
      , '//     <frag:main>'
      , '  //     </frag:main>'
      , '// </ frag:one >'
      , '// < frag:two >'
      , '// < frag:boom />'
      // NOT A FRAGMENT
      , 'const x = "foo"'
      , 'const y = "<frag:hello>"'
      , 'const x = 0 // <frag:foobar> '
      , '// some comment and stuff </frag:foobar >'
      , '// <frag:foobar > blah blah'
      ]
      .map ( line => fragmentInfo ( line, 'ts' ) )
    )
    .toEqual
    ( [ { name: 'foobar', type: 'open' }
      , { name: 'main', type: 'open' }
      , { name: 'main', type: 'close' }
      , { name: 'one', type: 'close' }
      , { name: 'two', type: 'open' }
      , { name: 'boom', type: 'empty' }
      , false
      , false
      , false
      , false
      , false
      ]
    )
  })
})

/*
describe ( 'extractSources', () => {
  it ( 'should return changed sources in Project', () => {
    const project = parse ( projectMarkdown ( 'testA' ) )
    const sources = extractSources ( project.fragments [ '$value1id.source' ] )
    expect
    ( sources [ 'value1id' ]
    )
    .toEqual ( '' )
  })
})
*/