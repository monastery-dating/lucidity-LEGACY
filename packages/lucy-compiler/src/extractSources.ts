import { ParsedSource, ParsedSourceElement, SourceFragment, StringMap } from './types'

interface FragmentInfo {
  name: string
  type: 'open' | 'close' | 'empty'
}


const RE_BY_LANG: StringMap < RegExp > =
{ ts: /^\s*\/\/\s*<(\/?)\s*frag:(\w+)\s*(\/?)>\s*$/
}

export function fragmentInfo
( line: string
, lang: string
): FragmentInfo | false {
  const re = RE_BY_LANG [ lang ]
  if ( ! re ) {
    throw new Error ( `Cannot extract fragments for lang '${ lang }'.`)
  }
  const info = re.exec ( line )
  if ( ! info ) {
    return false
  } else {
    const type = info [ 3 ]
      ? 'empty'
      : ( info [ 1 ]
          ? 'close'
          : 'open'
        )
    return { name: info [ 2 ], type }
  }
}

interface ParseResult {
  elem: ParsedSource
  idx: number
}

function parse
( lines: string []
, lang: string
, lineIdx: number = 0
, openFrag: string
): ParseResult {
  const sources: ParsedSourceElement [] = []
  // string accumulator
  let source: string | undefined = undefined
  let idx = lineIdx
  let line: string
  while ( ( line = lines [ idx ] ) !== undefined ) {
    const info = fragmentInfo ( line, lang )
    if ( info ) {
      if ( info.name === 'source' ) {
        throw new Error ( `Cannot open or close fragment named 'source' at line ${ idx }.` )
      }

      if ( info.name === openFrag ) {
        // Closing...
        if ( info.type !== 'close' ) {
          throw new Error ( `Invalid line ${ idx }, fragment '${ info.name }' already open.` )
        }

        if ( source ) {
          sources.push ( source )
        }
        return { idx, elem: { name: openFrag, sources } } 

      } else if ( info.type === 'close' ) {
        throw new Error ( `Invalid line ${ idx }, invalid closing fragment '${ info.name }', should be '${ openFrag }'.` )

      } else {
        // Open or empty
        // Add frag definition to source
        if ( ! source ) {
          source = line
        } else {
          source = source + '\n' + line
        }
        sources.push ( source )

        if ( info.type === 'open' ) {
          const res = parse ( lines, lang, idx + 1, info.name )
          idx = res.idx
          // Closed tag
          sources.push ( res.elem )
          // Add closing frag definition to next source block
          source = lines [ idx ]
        } else {
          // Empty tag
          sources.push
          ( { name: info.name, sources: [] }
          )
        }
      }
    } else {
      if ( ! source ) {
        source = line
      } else {
        source = source + '\n' + line
      }
    }
    idx += 1
  }

  if ( source ) {
    sources.push ( source )
  }
  return { idx, elem: { name: openFrag, sources } }
}

interface SourceToExtract {
  source: string
  lang: string
}

export function extractSources
( code: string
, lang: string
): ParsedSource {
  const { elem } = parse
  ( code.split ( '\n' )
  , lang
  , 0
  , 'source'
  )
  return elem
}
