/** When a Project is stored in the filesystem, we store it as a Tree like this:
 * PROJECT (folder)
 *   + 01_someName (section 01)
 *     + 01_someName (sub-section)
 *       + 01_someId.txt (text block)
 *       + 02_someId.ts  (script block)
 *       + 03_someId.jpg (image block)
 *       + branch (processing branch: max one per sub-section)
 *         + nodes.json (NodeDefinitionMap)
 *         + someTitle.someId.ts (Block main source)
 *         + someTitle.someId.frag (Block secondary source)
 *     + 02_someName (sub-section)
 *       + 01_someId.txt (text block)
 *       + 02_someId.ts (script block)
 *   + 02_otherName (section 02) 
 */

export interface StringMap < T > {
  [ id: string ]: T
}

export interface ContentBlock {
  type: 'project' | 'section' | 'paragraph' | 'script' | 'branch'
  source: string
  branch?: BranchDefinition
}

// This is the structure used for display and ordering of script
// executions.
export interface StringTree {
  children: string []
}

export interface Project {
  // Children ids do not point to treeMap if they do not have
  // sub-elements.
  treeMap: StringMap < StringTree >
  contentMap: StringMap < ContentBlock >
}

export interface BranchDefinition {
  // Root node id is always 'root'
  nodeMap: StringMap < NodeDefinition >
  blockMap: StringMap < BlockDefinition >
}

export interface NodeDefinition {
  id: string
  // Parent node id
  parentId?: string
  // Children node id
  childrenIds: string []
  // Content block id
  blockId: string
}

export interface BlockDefinition {
  id: string
  name: string
  source: string
  // extraSources: { type: string, source: string }
}

/** COMPILATION */

/** Compiled Project ready to be run */
export interface Program {
  // Ordered list of scripts to run to setup hooks
  scripts: string []
  scriptMap: StringMap < Script >
  branchMap: StringMap < Branch >
  // Direct access to the 
  placeholderMap: StringMap < Placeholder >
}

/** Compiled Paragraph of type 'script' */
export interface Script {
}

/** Compiled BranchDefinition */
export interface Branch {
}

export interface Node {
  isPlaceholder?: boolean 
}

export interface Placeholder extends Node {
  isPlaceholder: true
}