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
  // moved nodeId ( null if ownerType === 'library' )
  node: NodeType
  uinode: UINodeType
  // relative position on node
  nodePos: PosType
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
  // owner 'library', 'project', 'scene'
  ownerType?: string
  // new graph
  graph: GraphType
  //
  target: string
  // new ref in graph
  nodeId: string
}
