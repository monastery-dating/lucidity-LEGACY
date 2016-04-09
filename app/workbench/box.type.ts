import { SlotType } from './slot.type'

export interface BoxType {
  name: string
  in: SlotType[]
  out: SlotType
  
  // Project, Scene, etc (empty for regular file or box)
  type?: string

  // Specific to Box in graph
  // points to other ids in slot link order.
  // Can be null for empty slot.
  link?: string[]

  // Specific to Box in files
  sub?: string    // points to first child
  next?: string   // points to next sibling
}
