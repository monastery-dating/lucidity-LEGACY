import { UINodeType } from '../Graph'
interface PosType {
  x: number
  y: number
}

// This is the dragged node
export interface DragStartType {
  // 'library', 'project', 'scene'
  ownerType: string
  // moved nodeId ( null if ownerType === 'library' )
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
  // insert: slip the element between parentId and existing child
  // add: fill an empty slot
  operation: 'add' | 'insert' | 'abort'
  // node parent Id
  parentId?: string
  // slot in parent
  pos?: number
  // owner 'library', 'project', 'scene'
  ownerType?: string
  // absolute position
  clientPos?: PosType
}
