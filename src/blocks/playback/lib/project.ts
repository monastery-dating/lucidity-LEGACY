import { Project, BranchDefinition, SourceFragment } from 'playback'
import { extractSources } from 'blocks/playback/lib/extractSources';

export function newProject (): Project {
  return (
    { branches: {}
    , blockById: {}
    , blocksByName: {}
    , fragments: {}
    }
  )
}

let project: Project

export function getProject (): Project {
  if ( !project ) {
    project = newProject ()
  }
  return project
}

export function addBranch
( project: Project
, branch: BranchDefinition
) {
  project.branches [ branch.entry ] = branch
  const { blocks } = branch
  Object.keys ( blocks )
  .forEach
  ( key => {
      const block = blocks [ key ]
      if ( ! block.lang ) {
        block.lang = 'ts'
      }
      if ( project.blockById [ key ] ) {
        throw new Error ( `Duplicate block id '${key}'.`)
      }
      if ( ! block.name ) {
        throw new Error ( `Missing 'name' in block id '${key}.`)
      }

      project.blockById [ key ] = block
      let list = project.blocksByName [ block.name ]

      if ( ! list ) {
        list = []
        project.blocksByName [ block.name ] = list
      } else if ( list [ 0 ].lang !== block.lang ) {
        throw new Error ( `Blocks of the same name should share the same lang.` )
      }
      list.push ( block )
    }
  )
}

export function addFragment
( project: Project
, fragment: SourceFragment
) {
  project.fragments [ fragment.id ] = fragment
  fragment.sources = extractSources
  ( fragment.source
  , fragment.lang 
  ).sources
}

export function appendSource
( project: Project
, fragmentId: string
, source: string
) {
  const fragment = project.fragments [ fragmentId ]
  const s = fragment.source
  fragment.source = s === ''
    ? source
    : s + '\n' + source
  fragment.sources = extractSources
  ( fragment.source
  , fragment.lang 
  ).sources
}

export function changeBlockSource
( project: Project
, blockId: string
, source: string
) {
  // FIXME
  // ==> parse fragments
  // ==> link block source
  // ==> typecheck
}

export function changeFragmentSource
( project: Project
, fragmentId: string
, source: string
) {
  // FIXME
  // ==> update fragment
  // ==> link related block sources
  // ==> typecheck
}