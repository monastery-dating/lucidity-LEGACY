import { UINodeType, UIPosType } from './UINodeType'

export interface UINodeByIdType {
  [ key: string ]: UINodeType
}

export interface UIGraphType {
  // collect the list of node ids to draw
  nodes: string[]
  // collect information on these elements (size, etc)
  uiNodeById: UINodeByIdType
  // location of mouse in dragged object
  grabpos: UIPosType
}

export const initUIGraph = function
() : UIGraphType {
  return {
      nodes: []
    , grabpos: { x: 0, y: 0 }
    , uiNodeById: {}
    }
}
