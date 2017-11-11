import 
  { BranchDefinition
  , CompiledTree
  , CompiledNode
  , LinkedTree
  , LinkedNode
  , ParsedSourceElement
  , Program
  , Project
  , SourceFragment
  , StringMap
  } from './types'
import { extractSources } from './extractSources'
import { Block, Context, Helpers, Update } from 'lucidity'
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

function buildTree
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

  try {
    const codefunc = new Function
    ( 'exports', SCRUBBER_VAR, compiled.js )
    codefunc ( exported, compiled.scrub.values )
  } catch ( err ) {
    // TODO: Proper error handling.
    console.log ( err )
  }
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

/** The callback function must:
 * 1. transform node and write it into accumulator
 * 2. return unhandled children
 */
function mapTree <T>
( branch: BranchDefinition
, accumulator: StringMap < T >
, fun: ( parent: T | undefined, nodeId: string ) => T
, nodeId: string = branch.entry
, parent: T | undefined = undefined
): T {
  // map parent
  const result = fun ( parent, nodeId )

  accumulator [ nodeId ] = result

  // map children
  const childrenIds = branch.blocks [ nodeId ].children
  if ( childrenIds ) {
    childrenIds.forEach
    ( childId => mapTree
      ( branch
      , accumulator
      , fun
      , childId
      , result
      )
    )
  }

  return result
}

function compileTree
( branch: BranchDefinition
, sources: SourceMap
): CompiledTree {
  const compiledNodes: StringMap < CompiledNode > = {}
  mapTree
  ( branch
  , compiledNodes
  , ( parent, nodeId ) => compileNode ( sources [ nodeId ] )
  )
  return { compiledNodes }
}

function linkNode
( baseHelpers: Helpers
, accumulator: StringMap < LinkedNode >
, typedChildren: LinkedNode []
, floatingChildren: LinkedNode []
, nodeId: string
, node: CompiledNode
): { typed?: LinkedNode, floatingChildren: LinkedNode [] } {
  const { meta } = node
  const helpers: Helpers =
  Object.assign
  ( {}
  , baseHelpers
  )

  // Create LinkedNode
  const self = accumulator [ nodeId ] = Object.assign
  ( { helpers }
  , node
  )

  if ( ! meta ) {
    // ********* Not dealing with children.
    if ( typedChildren.length ) {
      throw new Error
      ( `Invalid node '${nodeId}' (it has no children type information and contains typed children).` )
    }

    if ( node.update ) {
      return { floatingChildren: [ ...floatingChildren, self ] }
    } else {
      return { floatingChildren }
    }

  } else if ( meta.children === undefined ) {
    // ********* Not dealing with children but has meta.
    if ( typedChildren.length ) {
      throw new Error
      ( `Invalid node '${nodeId}' (it has no children type information and contains typed children).` )
    }

    if ( meta.update ) {
      if ( ! node.update ) {
        throw new Error
        ( `Invalid node '${nodeId} (it contains update type but no update function).` )
      }
      return { typed: self, floatingChildren }
    } else if ( node.update ) {
      return { floatingChildren: [ ...floatingChildren, self ] }
    } else {
      return { floatingChildren }
    }

  } else if ( meta.children === 'all' ) {
    // ********* We run floating children
    if ( typedChildren.length ) {
      throw new Error
      ( `Invalid node '${nodeId}' (it has children 'all' and contains typed children).` )
    }

    const list = < Update [] > floatingChildren.map ( child => child.update )
    helpers.children =
    { all () { 
        for ( const f of list ) {
          f ()
        }
      } 
    }

    if ( meta.update ) {
      return { typed: self, floatingChildren: [] }
    } else if ( node.update ) {
      return { floatingChildren: [ self ] }
    } else {
      throw new Error
      ( `Invalid node: has children 'all' setting but no update function.` )
    }

  } else if ( meta.children ) {
    // ********* We run our own typed children
    helpers.children = < Update [] > typedChildren.map ( child => child.update )

    if ( meta.update ) {
      return { typed: self, floatingChildren }
    } else if ( node.update ) {
      return { floatingChildren: [ ...floatingChildren, self ] }
    } else {
      throw new Error
      ( `Invalid node: has typed children but no update function.` )
    }
  }
  // Unreachable code
  throw new Error ( `BUG: A case in linkNode not taken care of: ${
    JSON.stringify ( node, null, 2 )
  }`)
}

function linkOne
( branch: BranchDefinition
, accumulator: StringMap < LinkedNode >
, fun:
  ( accumulator: StringMap < LinkedNode >
  , typedChildren: LinkedNode []
  , floatingChildren: LinkedNode []
  , nodeId: string
  ) => { typed?: LinkedNode, floatingChildren: LinkedNode [] }
, nodeId: string = branch.entry
): { typed?: LinkedNode, floatingChildren: LinkedNode [] } {
  // map children
  const childrenIds = branch.blocks [ nodeId ].children
  const typedChildren: LinkedNode [] = []
  let allFloatingChildren: LinkedNode [] = []
  if ( childrenIds ) {
    childrenIds.map
    ( childId => linkOne
      ( branch
      , accumulator
      , fun
      , childId
      )
    ).forEach
    ( ( { typed, floatingChildren } ) => {
        if ( typed ) {
          typedChildren.push ( typed )
        }
        if ( floatingChildren.length ) {
          allFloatingChildren = allFloatingChildren.concat ( floatingChildren )
        }
      }
    )
  }
  // map parent
  return fun ( accumulator, typedChildren, allFloatingChildren, nodeId )
}

function linkTree
( branch: BranchDefinition
, tree: CompiledTree
): LinkedTree {
  const { compiledNodes } = tree
  const linkedNodes: StringMap < LinkedNode > = {}

  const baseHelpers: Helpers =
  { context: {}
  , contextForChildren: {}
  , children: []
  , cache: {}
  , detached: false
  }

  const result = linkOne
  ( branch
  , linkedNodes
  , ( acc, typedChildren, floatingChildren, nodeId ) =>
      linkNode
      ( baseHelpers
      , acc
      , typedChildren
      , floatingChildren
      , nodeId
      , compiledNodes [ nodeId ]
      )
  )
  if ( result.typed ) {
    throw new Error
    ( `Invalid project: root node '${ branch.entry }' is typed.` )
  }
  const list = < Update [] > result.floatingChildren.map
  ( child => child.update )

  const main = () => {
    for ( const f of list ) {
      f ()
    }
  }

  return { linkedNodes, main }
}

function subContext <T, U>
( base: T
, updates: U
): Readonly < T & U > {
  return Object.freeze
  ( Object.assign
    ( {}, base, updates )
  )
}

interface NodeWithContext {
  helpers: { contextForChildren: Context }
}

function initNode
( parent: NodeWithContext
, nodeId: string
, node: LinkedNode
): LinkedNode {
  const { init, helpers } = node
  helpers.context = parent.helpers.contextForChildren

  if ( init ) {
    let result
    try {
      result = init ( helpers )
    } catch ( err ) {
      console.log ( node.js )
      throw new Error
      ( `Error running 'init' from '${ nodeId }': ${ err }` )
    }
    if ( result ) {
      if ( typeof result !== 'object' ) {
        throw new Error
        ( `Error running '${nodeId}: init return value must be an object.` )
      }
      else {
        helpers.contextForChildren =
        subContext ( helpers.context, result )
      }
    }
  }
  return node
}

function initTree
( branch: BranchDefinition
, tree: LinkedTree
): LinkedTree {
  // We simply update the linked node for each child
  const base = { helpers: { contextForChildren: subContext ( {}, {} ) } }
  const { linkedNodes } = tree
  const initNodes: StringMap < LinkedNode > = {}
  mapTree
  ( branch
  , initNodes // Dummy, accumulator is discarded
  , ( parent, nodeId ) => initNode
      ( parent || base
      , nodeId
      , linkedNodes [ nodeId ]
      )
  )
  return tree
}

export function compile
( project: Project
): Program {
  const branch = buildTree ( project )
  const sources = updateSources ( project )
  const compiledTree = compileTree ( branch, sources )
  const linkedTree = linkTree ( branch, compiledTree )
  return initTree ( branch, linkedTree )
}