import { Block, Helpers } from 'lucidity'

export interface StringMap < T > {
  [ id: string ]: T
}

/********** SERIALIZED TYPES **********************/

export interface SerializedBlockType {
  name: string
  lang: string
}

export interface SerializedBranch extends BranchDefinition {
  blocks: StringMap < SerializedBlockType >
}

/********** PROJECT TYPE **************************/

export interface BasicBlockType extends SerializedBlockType {
  id: string
}

type NodeDefinition = string []

export interface BranchDefinition {
  // Name of the location to connect this branch
  branch: string
  // Root of this branch
  entry: string
  nodes: StringMap < NodeDefinition >
}

export interface Project {
  branches: BranchDefinition []
  blockById: StringMap < BasicBlockType >
  blocksByName: StringMap < BasicBlockType [] >
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