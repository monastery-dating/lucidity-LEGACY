import { Block, Meta, Helpers, StringMap } from 'blocks/lucidity/lucidity.types'
import { v4 } from 'uuid'

export { StringMap } from 'blocks/lucidity/lucidity.types'

export function makeId ( scope: { [ key: string ]: any } ) {
  let id: string
  do {
    id = v4 ().slice ( 0, 6 )
  } while ( scope [ id ] )
  return id
}

/********** SERIALIZED TYPES **********************/
// This is saved data.

export interface ParsedMeta extends Meta {
  // set to true if children: 'all'
  all?: boolean
  // set to true if it has an update but not type for update
  isvoid?: boolean
  children?: string[]
}

export interface BlockDefinition {
  id: string
  children: string []
  name: string
  lang: string
  source: string
  // Extracted from source but saved for faster usage
  meta: ParsedMeta

  // ** UI stuff **
  closed?: boolean
}

export interface LiveBlock extends BlockDefinition {
  branch: LiveBranch
  // ** Compilation feedback in UI ** 
  // Context errors
  cerr?: string []
  // When a block is invalid, it is not initialized nor updated.
  invalid?: boolean
  // Slot connection errors (renders block invalid)
  serr?: string []
}

/********** PROJECT TYPE **************************/

export interface BranchDefinition {
  blocks: StringMap < BlockDefinition >
  // Name of the location to connect this branch. During drag/drop operations,
  // connect can be undefined.
  connect?: string
  id: string
  // Root of this branch (also serves as branch id)
  entry?: string
}

export interface LiveBranch extends BranchDefinition {
  project: Project
}

export interface Project {
  branches: StringMap < BranchDefinition >
  blockById: StringMap < BlockDefinition >
  blocksByName: StringMap < BlockDefinition [] >
  fragments: StringMap < SourceFragment >
  rootContext: { [ key: string ]: any }
}

export type FragmentType = '@' | '$'

/** A target like @foo.main translates into
 * type = @
 * target = foo
 * frag = main
 */
export interface SourceFragment {
  id: string
  type: FragmentType
  target: string
  frag: string
  lang: string
  source: string
  sources: ParsedSourceElement []
}

/** Extracted source and fragments
 * 
 */
export interface ParsedSource {
  name: string
  // Default source for this fragment
  sources: ParsedSourceElement [] 
}

export type ParsedSourceElement = ParsedSource | string


/********** PROGRAM TYPE **************************/

// This is in memory in the Playback engine.

export interface CompiledNode extends Block {
  js: string
}

export interface LinkedNode extends CompiledNode {
  helpers: Helpers
}

export interface CompiledTree {
  compiledNodes: StringMap < CompiledNode >
}

export interface LinkedTree {
  main (): void
  linkedNodes: StringMap < LinkedNode >
}

/** Compiled Project ready to be run
 * This is the public API of a LinkedTree
 */
export interface Program {
  main (): void
}

// Ensure that the two types are compatible
const test = < Program > < LinkedTree > {}