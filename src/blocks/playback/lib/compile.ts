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
import { LiveProject } from 'blocks/playback';
import { LiveBranch } from 'blocks/playback/lib/branch';

interface Source {
  lang: string
  source: string
}

type SourceMap = StringMap < Source >

function serialize
( project: LiveProject
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

export function buildSources
( project: LiveProject
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
      let base = project.fragments [ `$${ blockId }.source` ]
      if ( ! base ) {
        // Block does not have a source.
        blocks [ blockId ] =
        { lang: 'ts'
        , source: ''
        }
      } else {
        blocks [ blockId ] = 
        { lang: block.lang
        , source: serialize
          ( project, block.name, { name: 'source', sources: base.sources } )
        }
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
( project: LiveProject
): LiveBranch | undefined {
  const { branches } = project
  return Object.keys ( branches ).map
  ( b => branches [ b ] ).find
  ( b => b.connect === 'root' )
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
( branch: LiveBranch
, accumulator: StringMap < T >
, fun: ( parent: T | undefined, nodeId: string ) => T
, blockId: string | undefined = branch.entry
, parent: T | undefined = undefined
) {
  if ( blockId === undefined ) {
    // Empty branch
    return
  }
  // map parent
  const result = fun ( parent, blockId )

  accumulator [ blockId ] = result

  // map children
  const childrenIds = branch.blocks [ blockId ].children
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
}

function compileTree
( branch: LiveBranch
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
, blockId: string | undefined = branch.entry
): { typed?: LinkedNode, floatingChildren: LinkedNode [] } {
  if ( blockId === undefined ) {
    // Empty branch
    return { floatingChildren: [] }
  }
  // map children
  const childrenIds = branch.blocks [ blockId ].children
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
  return fun ( accumulator, typedChildren, allFloatingChildren, blockId )
}

function linkTree
( project: LiveProject
, branch: BranchDefinition
, tree: CompiledTree
): LinkedTree {
  const { compiledNodes } = tree
  const linkedNodes: StringMap < LinkedNode > = {}

  const baseHelpers: Helpers =
  { context: project.context
  , contextForChildren: Object.assign ( project.context )
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
( project: LiveProject
, branch: LiveBranch
, tree: LinkedTree
): LinkedTree {
  // We simply update the linked node for each child
  const base = { helpers: { contextForChildren: subContext ( project.context, {} ) } }
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
( project: LiveProject
): Program {
  const root = findRoot ( project )
  if ( !root ) {
    // Nothing to run or compile if branches are not connected.
    return { main () {} }
  }

  // Build sources from fragments
  const sources = buildSources ( project )
  // Compile sources and run the module to get exported content
  // for all blocks in tree.
  const compiledTree = compileTree ( root, sources )
  // Link the result from exported contents to create an executable
  const linkedTree = linkTree ( project, root, compiledTree )
  // Run init code in every block
  return initTree ( project, root, linkedTree )
}

/**
 * To optimise compilation, we could:
 * 
 * 1. only build the sources for the blocks that have changed (the changed
 * blocks are extracted from a dependency graph listing
 * { [ fragmentId ]: blockId [] }.
 * 
 * 2. only compile changed sources (merge compiledTree with previous run).
 * 
 * 3. only init parts of tree that have been impacted (below changed blockIds)
 * 
 */