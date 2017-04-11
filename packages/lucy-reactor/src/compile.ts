import
{ ContentBlock
, Program
, Project
, StringMap
} from './types'

interface UpdateProgram {
 ( id: string
 , content: ContentBlock
 , program: Program
 ) 
}

const UPDATE_PROGRAM: StringMap < UpdateProgram > =
{ script ( id, content, program ) {
    program.scriptMap [ id ] = content
  }
, branch ( id, content, program ) {
    program.branchMap [ id ] = content
  }
}

function parse
( id: string
, project: Project
, program: Program
): void {
  const content: ContentBlock = project.contentMap [ id ]
  const update = content ? UPDATE_PROGRAM [ content.type ] : undefined
  if ( update ) {
    update ( id, content, program )
  }
  const tree = project.treeMap [ id ]
  if ( tree ) {
    tree.children.forEach
    ( id => parse ( id, project, program ) )
  }
}

export function compile
( project: Project
): Program {
  const program: Program =
  { scripts: []
  , scriptMap: {}
  , branchMap: {}
  , placeholderMap: {}
  }
  parse ( 'root', project, program )

  return program
}