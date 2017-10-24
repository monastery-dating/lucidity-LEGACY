import { extractSources, fragmentInfo } from './extractSources'
import { projectMarkdown } from './test/test-util'
import { parse } from './parse'
import { ParsedSourceElement } from './types'

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

function serialize
( elem: ParsedSourceElement
, name: string = '...'
): string {
  if ( typeof elem === 'string' ) {
    return `${ name }: ${ elem }`
  } else {
    return `${ name } ==> ${ elem.name }\n${
        elem.sources.map
        ( ( e, idx ) => serialize ( e, `${ elem.name }${ idx }` )
        ).join ( '\n' )
      }`
  }
}

describe ( 'extractSources', () => {
  it ( 'should return changed sources in Project', () => {
    const code = `
    export const update: Update =
    (): number => {
      // <frag:main>
      return 0
      // </frag:main>
    }
    // code end
    `

    const elem = extractSources ( code, 'ts' )
    expect
    ( elem.name
    )
    .toEqual ( 'source' )
    expect
    ( serialize ( elem ).split ( '\n' )
    )
    .toEqual
    ( [ "... ==> source"
      , "source0:     export const update: Update ="
      , "    (): number => {"
      , "      // <frag:main>"
      , "source1 ==> main"
      , "main0:       return 0"
      , "source2:       // </frag:main>"
      , "    }"
      , "    // code end"
      , "    "
      ]
    )
  })
})