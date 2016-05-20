import { UINodeType, UIPosType, UIGhostNodeType } from './uinode.type'

export interface UINodeByIdType {
  [ key: string ]: UINodeType
}

export interface UIGraphType {
  // collect the list of ids to draw
  list: string[]
  // collect information on these elements (size, etc)
  uiNodeById: UINodeByIdType
  // location of mouse in dragged object
  grabpos: UIPosType
  // object to add on drop
  dropghost?: UIGhostNodeType
}

export const initUIGraph = function
() : UIGraphType {
  return {
      list: []
    , grabpos: { x: 0, y: 0 }
    , uiNodeById: {}
    }
}
