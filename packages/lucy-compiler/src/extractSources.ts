import { SourceFragment, StringMap } from './types'

interface FragmentName {
  name: string
  // Default source for this fragment
  source: string
}

interface FragmentInfo {
  name: string
  type: 'open' | 'close' | 'empty'
}

type SourceElement = FragmentName | string

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

export function extractSources
( code: SourceFragment
): SourceElement [] {

  return []
}
