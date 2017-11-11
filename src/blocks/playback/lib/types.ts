import { Block, Meta, Helpers, StringMap } from 'lucidity'

export { StringMap } from 'lucidity'

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
  // Name of the location to connect this branch
  branch: string
  blocks: StringMap < BlockDefinition >
  // Root of this branch
  entry: string
}

export interface Project {
  branches: BranchDefinition []
  blockById: StringMap < BlockDefinition >
  blocksByName: StringMap < BlockDefinition [] >
  fragments: StringMap < SourceFragment >
}

export type FragmentType = '@' | '$'

/** A target like @foo.main translates into
 * type = @
 * target = foo
 * frag = main
 */
export interface SourceFragment {
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