import { GraphType } from '../Graph'
import { SlotType } from './SlotType'

export interface BlockTypeChanges {
  // True if the node has an init function
  init?: boolean

  name?: string
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
  // database related
  _id: string
  _rev?: string
  type: string // must be 'block'
  //

  name: string
  source: string
  // If this is true, we have a sub-graph
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
