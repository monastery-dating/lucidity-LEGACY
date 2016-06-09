import { GraphType } from '../Graph'
import { SlotType } from './SlotType'

export interface BlockTypeChanges {
  name?: string
  source?: string
}

interface StringMap {
  [ key: string ]: string
}

export interface BlockMetaType {
  author?: string
  description?: string
  tags?: string[]
  // context changes
  expect?: StringMap
  // one for each slot
  provide?: StringMap
  // input/output return types
  input?: string[]
  output?: string
  // This should only be true for the 'main' element in a graph.
  // We use this information to set 'provides' to the root context of
  // a rendering playback.
  main?: boolean
}

export interface BlockSourceInfo {
  // The following elements should be deduced
  // from the source code
  js: string // compiled source
  input: SlotType[]
  output: SlotType
  meta: BlockMetaType
}

export interface BlockType extends BlockSourceInfo {
  id: string
  name: string
  source: string

  // If this is true, we have a sub-graph
  // It creates a graph that behaves like an object (a way to group nodes)
  // graph?: GraphType
}

export interface BlockByIdType {
  [ id: string ]: BlockType
}

export interface BlockAddOperationType {
  pos: number
  parentId: string
  ownerType: string
  componentId?: string
}

// basic compiler type checks
const typetest = function
( a: BlockType ) : BlockTypeChanges {
  return a
}
