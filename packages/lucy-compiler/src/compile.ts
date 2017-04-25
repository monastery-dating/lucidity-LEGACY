import { Program, Project, SourceFragment, StringMap } from './types'
import { extractSources } from './extractSources'

export interface SourceCache {
  [ key: string ]: string
}

export function updateSources
( cache: SourceCache
, project: Project
): StringMap < string > {
  const blocks: StringMap < string > = {}

  Object.keys ( project.blockById )
  .forEach
  ( blockId => {
      const base = project.fragments [ `$${ blockId }.source` ]
      if ( ! base ) {
        throw new Error ( `Missing '$${ blockId }.source'.` )
      }
      const sources = extractSources ( base )
      // XXXXX
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