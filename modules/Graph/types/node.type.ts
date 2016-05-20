import { GraphType } from './graph.type'
import { SlotType } from './slot.type'

export interface NodeTypeChanges {
  // True if the node has an init function
  init?: boolean
  type?: string // 'Node' | 'Graph'

  name?: string
  path?: string
  source?: string
  // The following elements should be deduced
  // from the source code
  input?: SlotType[]
  output?: SlotType
}

export interface NodeIOType {
  // The following elements should be deduced
  // from the source code
  input: SlotType[]
  output: SlotType
  // True if the node has an init function
  init: boolean
}

export interface NodeType extends NodeIOType {
  type: string // 'Node' | 'Graph'

  name: string
  path: string
  source: string
  // This is set for type 'Graph'
  // It creates a graph that behaves like an object (a way to group nodes)
  graph?: GraphType
}

export interface NodeByIdType {
  [ id: string ]: NodeType
}


// basic compiler type checks
const typetest = function
( a: NodeType ) : NodeTypeChanges {
  return a
}
