import { extractSources, fragmentInfo } from './extractSources'
import { parse } from './parse'
import { ParsedSourceElement } from './types'

describe ( 'fragmentInfo', () => {
  it ( 'should parse single ts line', () => {
    expect
    ( [ '   // <foobar>  '
      , '//     <main>'
      , '  //     </main>'
      , '// </ one >'
      , '// < two >'
      , '// < boom />'
      // NOT A FRAGMENT
      , 'const x = "foo"'
      , 'const y = "<hello>"'
      , 'const x = 0 // <foobar> '
      , '// some comment and stuff </foobar >'
      , '// <foobar > blah blah'
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
      // <main>
      return 0
      // </main>
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
      , "      // <main>"
      , "source1 ==> main"
      , "main0:       return 0"
      , "source2:       // </main>"
      , "    }"
      , "    // code end"
      , "    "
      ]
    )
  })
})