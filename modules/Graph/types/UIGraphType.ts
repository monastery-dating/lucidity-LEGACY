import { UINodeType, UIPosType } from './UINodeType'

export interface UINodeByIdType {
  [ key: string ]: UINodeType
}

interface SizeType {
  width: number
  height: number
}

export interface UIGraphType {
  // collect the list of node ids to draw
  nodes: string[]
  // collect information on these elements (size, etc)
  uiNodeById: UINodeByIdType
  // location of mouse in dragged object
  grabpos: UIPosType
  // total graph size
  size: SizeType
}
