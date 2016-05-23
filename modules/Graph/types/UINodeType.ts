import { BlockType } from './BlockType'

export interface UIPosType {
  x: number
  y: number
}

export interface UINodeSize {
  // used to skip computation if name did not change
  cacheName: string
  w: number
  h: number
  tx: number // text position x
  ty: number // and y
  wd: number
  wu: number
  ds: number
  us: number
  wde: number
}

export interface SlotFlagType {
  free?: boolean
  detached?: boolean
}

export interface UISlotType {
  // Center of slot position.
  pos: UIPosType
  // position in slot
  idx: number

  flags: SlotFlagType

  // The fields below could be kept inside layout (constants)
  // slot path
  path: string
  // click area path for the slot (if needed)
  click: string
  // path for plus sign (if needed)
  plus: string
}

export interface UINodeType {
  type?: string
  name: string
  id: string
  blockId: string
  size: UINodeSize
  pos: UIPosType
  sextra: number[]

  // During drag/drop operation, this is true for
  // drop previsualisation (not the dragged element).
  isGhost?: boolean
  // can contain more then one class ( for ghost element )
  className: string
  // draw path
  path: string
  // slot paths
  slots: UISlotType[]
}

export interface UIGhostBlockType {
  node: BlockType
  uinode: UINodeType
  linkpos?: number // if box can be dropped, this is the position in parent links
  parentId?: string  // parent boxid if can be dropped
  nodeId?: string
  x: number
  y: number
}
