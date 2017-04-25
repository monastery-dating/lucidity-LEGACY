import { ParsedSourceElement, Program, Project, SourceFragment, StringMap } from './types'
import { extractSources } from './extractSources'

export interface SourceCache {
  [ key: string ]: string
}


function serialize
( project: Project
, blockName: string 
, elem: ParsedSourceElement
): string {
  if ( typeof elem === 'string' ) {
    return elem
  } else {
    const fragName = `@${ blockName }.${ elem.name }`
    const frag = project.fragments [ fragName ]
    let sources: ParsedSourceElement []
    if ( frag ) {
      sources = frag.sources
    } else {
      // Use default fragment content
      sources = elem.sources
    }
    return sources.map
      ( e => serialize ( project, blockName, e )
      ).join ( '\n' )
  }
}

export function updateSources
( cache: SourceCache
, project: Project
): StringMap < string > {
  const blocks: StringMap < string > = {}

  /** 
   * FIXME: we should optimize this a lot for live coding to only rebuild
   * source and recompile things that actually changed.
   */
  Object.keys ( project.blockById )
  .forEach
  ( blockId => {
      const block = project.blockById [ blockId ]
      const base = project.fragments [ `$${ blockId }.source` ]
      if ( ! base ) {
        throw new Error ( `Missing '$${ blockId }.source'.` )
      }
      blocks [ blockId ] = serialize
      ( project, block.name, { name: 'source', sources: base.sources } )
    }
  )

  return blocks
}

export function compile
( project: Project
): Program {
  // TODO...

  return {}
}