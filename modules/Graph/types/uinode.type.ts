import { NodeType } from './node.type'

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

export interface UISlotType {
  path: string
  className: string
}

export interface UINodeType {
  type?: string
  name: string
  id: string
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

export interface UIGhostNodeType {
  node: NodeType
  uinode: UINodeType
  linkpos?: number // if box can be dropped, this is the position in parent links
  parentId?: string  // parent boxid if can be dropped
  nodeId?: string
  x: number
  y: number
}
