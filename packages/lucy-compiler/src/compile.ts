import 
  { BranchDefinition
  , CompiledTree
  , CompiledNode
  , ParsedSourceElement
  , Program
  , Project
  , SourceFragment
  , StringMap
  } from './types'
import { extractSources } from './extractSources'
import { Block } from 'lucidity'
import
  { compilers
  , CompileResult
  , CompileSuccess
  , isCompileSuccess
  , SCRUBBER_VAR
  } from './compilers'

interface Source {
  lang: string
  source: string
}

type SourceMap = StringMap < Source >

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
( project: Project
): SourceMap {
  const blocks: SourceMap = {}

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
      blocks [ blockId ] = 
      { lang: block.lang
      , source: serialize
        ( project, block.name, { name: 'source', sources: base.sources } )
      }
    }
  )

  return blocks
}
/*

export interface Project {
  branches: BranchDefinition []
  blockById: StringMap < BasicBlockType >
  blocksByName: StringMap < BasicBlockType [] >
  fragments: StringMap < SourceFragment >
}
*/

function findRoot
( project: Project
): BranchDefinition {
  const root = project.branches.find
  ( b => b.branch === 'root' )
  if ( ! root ) {
    throw new Error
    ( `Invalid project: missing node branching to root.` )
  }
  return root
}

function compileSource
( source: Source
): CompileResult {
  const compile = compilers [ source.lang ]
  if ( ! compile ) {
    throw new Error
    ( `Invalid source: no compiler for language '${ source.lang }'.` )
  }
  return compile ( source.source )
}

function runModule
( compiled: CompileSuccess
): Block {
  const exported: Block = {}

  // try {
  const codefunc = new Function ( 'exports', SCRUBBER_VAR, compiled.js )
  codefunc ( exported, compiled.scrub.values )
  //} catch ( err ) {
    // TODO: Proper error handling.
  // }
  return exported
}

function compileNode
( source: Source
): CompiledNode {
  const compiled = compileSource ( source )
  if ( ! isCompileSuccess ( compiled ) ) {
    const { errors } = compiled
    // Of course, this should bubble properly up to the inline editor. But for
    // now we just break.
    throw new Error ( `Could not compile: ${ errors.map ( e => e.message ) }.`)
  }
  const exported = runModule ( compiled )

  return Object.assign ( compiled, exported )
}

function mapTree <T>
( project: Project
, nodeId: string
, fun: ( nodeId: string ) => T
, result: StringMap < T > = {}
): StringMap < T > {
  // map parent
  result [ nodeId ] = fun ( nodeId )
  // map children

  return result
}

function compileTree
( project: Project
, sources: SourceMap
): CompiledTree {
  const root = findRoot ( project )
  const compiledNodes =
  mapTree
  ( project
  , root.entry
  , nodeId => compileNode ( sources [ nodeId ] )
  )
  // 1. Get full source
  // 2. Compile source
  // 3. Run script to get exports
  // 4. Read meta
  // 5. Process children
  return { compiledNodes }
}

function initTree
( project: Project
, branch: CompiledTree
) {
  // Call init in all nodes (parent first).
}

export function compile
( project: Project
): Program {
  // console.log(JSON.stringify(project, null, 2))
  // FIXME: use
  const sources = updateSources ( project )
  const tree = compileTree ( project, sources )
  initTree ( project, tree )

  return {}
}