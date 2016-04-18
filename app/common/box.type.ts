import { SlotType } from './slot.type'

export interface BoxType {
  name: string
  in: SlotType[]
  out: SlotType

  // Project, Scene, etc
  type: string

  // Specific to Box in graph
  // points to other ids in slot link order.
  // Can be null for empty slot.
  link?: string[]
  // True if the block has an init function
  init?: boolean

  // Specific to Box in files
  sub?: string    // points to first child
  next?: string   // points to next sibling
}

export interface FileType extends BoxType {
  next: string   // points to next sibling
}

export const initBox = function () : BoxType {
  return { name: 'main'
    , in: []
    , out: null
    }
}
