import { BlockType } from '../../Block'

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
  ds: number // number of down slots
  hasExtra: boolean // extra slot on right of node
  us: number
  wde: number
}

export interface SlotFlagType {
  free?: boolean
  incompatible?: boolean
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

export interface UIArrowType {
  path: string
  click: string // click zone
  class: { open?: boolean, closed?:boolean, arrow: boolean }
}

export interface UINodeType {
  type?: string
  name: string
  id: string
  size: UINodeSize
  pos: UIPosType
  sextra: number[]

  // can contain more then one class ( for ghost element )
  className: string
  invalid?: boolean
  // draw path
  path: string
  // slot paths
  slots: UISlotType[]
  // position in parent
  slotIdx: number
  arrow: UIArrowType
}

export interface UIDropType {
  nodeId: string
  slotId: number
}
