import { BlockType } from '../Block'
import { NodeType, UINodeType, GraphType } from '../Graph'
interface PosType {
  x: number
  y: number
}

// This is the dragged node
export interface DragStartType {
  // 'library', 'project', 'scene'
  ownerType: string
  // relative position on node
  nodePos: PosType
  blockId: string

  // Used to identify starting node
  nodeId?: string

  // Used on scene/project drag operation
  graph?: GraphType

  // Computed on drag signal from blockId
  block?: BlockType
  // Computed if not provided (library drag)
  uinode?: UINodeType
}

// This is the drop zone
export interface DragMoveType {
  // insert: slip the element between parentId and existing child
  // add: fill an empty slot
  target: string
  // absolute position
  clientPos: PosType
}

// This is the drop zone
export interface DragDropType {
  target: string
  // owner 'library', 'project', 'scene'
  ownerType: string
  // new graph. Not needed on library drop
  graph?: GraphType
  // new ref in graph. Not needed on library
  nodeId?: string
}
