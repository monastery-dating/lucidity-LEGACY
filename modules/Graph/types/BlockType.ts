import { GraphType } from './GraphType'
import { SlotType } from './SlotType'

export interface BlockTypeChanges {
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

export interface BlockIOType {
  // The following elements should be deduced
  // from the source code
  input: SlotType[]
  output: SlotType
  // True if the node has an init function
  init: boolean
}

export interface BlockType extends BlockIOType {
  type: string // 'Block' | 'Graph'
  _id?: string
  _rev?: string

  name: string
  path: string
  source: string
  // This is set for type 'Graph'
  // It creates a graph that behaves like an object (a way to group nodes)
  graph?: GraphType
}

export interface BlockByIdType {
  [ id: string ]: BlockType
}


// basic compiler type checks
const typetest = function
( a: BlockType ) : BlockTypeChanges {
  return a
}
