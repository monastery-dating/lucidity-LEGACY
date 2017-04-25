import { extractSources, fragmentInfo, ParsedSourceElement } from './extractSources'
import { projectMarkdown } from './test/test-util'
import { parse } from './parse'

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
    const project = parse ( projectMarkdown ( 'testA' ) )
    const elem = extractSources ( project.fragments [ '$value1id.source' ] )
    expect
    ( elem.name
    )
    .toEqual ( 'source' )
    expect
    ( serialize ( elem ).split ( '\n' )
    )
    .toEqual
    ( [ "... ==> source"
      , "source0: export const update: Update ="
      , "(): number => {"
      , "  // <frag:main>"
      , "source1 ==> main"
      , "main0:   return 0"
      , "source2:   // </frag:main>"
      , "}"
      , ""
      , "export const meta: Meta ="
      , '{ description: "Return a number."'
      , ", tags: [ 'test', 'value' ]"
      , ", author: 'Gaspard Bucher <gaspard@lucidity.io>'"
      , ", origin: 'lucidity.io/value'"
      , ", version: '1.0'"
      , ", update: '(): number'"
      , "}"
      ]
    )
  })
})