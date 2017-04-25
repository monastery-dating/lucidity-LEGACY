export interface StringMap < T > {
  [ id: string ]: T
}

/********** SERIALIZED TYPES **********************/

export interface SerializedBlockType {
  name: string
  lang: string
}

export interface SerializedBranch extends BranchDefinition {
  lucidity: 'branch' 
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

type FragmentType = '@' | '$'

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
  sources: string []
}

/********** PROGRAM TYPE **************************/

/** Compiled Project ready to be run */
export interface Program {
}
