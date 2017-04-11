export interface StringMap {
  [ key: string ] : string
}

/** This is the type of the 'meta' field defined in every code
 * block.
 */
export interface Meta {
  // only mandatory in the official library
  description : string
  tags : string []
  author : string
  origin : string
  version : string
  // end mandatory
  expect? : StringMap
  provide? : StringMap
  children? : string [] | 'all'
  update? : string
}

/****************** STORAGE *****************/

/** A Block is an element of source code. */
export interface Block {
  id : string
  name : string
  source : string
  meta : Meta
}

/** An element in the processing tree.
 * 
 */
export interface Node {
  id : string
  blockId : string

  parent? : string
  children : string []
}

interface NodeMap {
  [ id : string ] : Node
}

interface BlockMap {
  [ id : string ] : Block
}

export interface Branch {
  nodeMap : NodeMap
  blockMap : BlockMap
  scriptMap : ScriptMap

  scripts : string []
  rootNodeId : string
}

export interface Tree {
  // Ordered ids of the branches top elements.
  branches : string []
}

/****************** COMPILED *****************/

export interface CompiledBlock extends Block {
}

export interface CompiledNode {
  compiledBlock : CompiledBlock
  isPlaceholder? : boolean
  isBranch? : boolean
}

interface CompiledNodeMap {
  [ id : string ] : CompiledNode
}

interface CompiledBlockMap {
  [ id : string ] : CompiledBlock
}

export interface CompiledTree extends Tree {
  compiledNodeMap : CompiledNodeMap
  compiledBlockMap : CompiledBlockMap

  root : CompiledNode
}


/** An empty named node.
 * A Placeholder's name must start with '#'.
 */
export interface Placeholder extends Node {
  isPlaceholder : true
  // List of currently connected branches. During execution, the
  // branches are executed in order. This is really as if the
  // branches are stacked on top of each other (this implies that
  // every branch's bottom slot has the same type as the input
  // slot)
  branches : string []
}

/** Part of a tree that may be connected to one or more
 * Placeholders. A Branch's name must start with '@'.
 */
export interface Branch extends Node {
  isBranch : true
}