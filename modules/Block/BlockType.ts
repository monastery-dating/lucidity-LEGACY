import { GraphType } from '../Graph'
import { SlotType } from './SlotType'

export interface BlockTypeChanges {
  name?: string
  source?: string
}

interface TypeMap {
  [ key: string ]: string
}

export interface PlaybackMetaType {
  // context changes
  expect?: TypeMap
  // one for each slot
  provide?: TypeMap
  all?: boolean // set to true if children: 'all'
  isvoid?: boolean // set to true if it has an update but not type for update
  children?: string[]
  update?: string // normalized type
}

export interface BlockSourceInfo {
  // The following elements should be deduced
  // from the source code
  js: string // compiled source
  input: SlotType[] // FIXME: remove
  output: SlotType  // FIXME: remove
  meta: PlaybackMetaType
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
