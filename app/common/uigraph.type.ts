import { UIBoxType, UIPosType } from './uibox.type'

export interface UIBoxesType {
  [ key: string ]: UIBoxType
}

export interface UIGraphType {
  // collect the list of ids to draw
  list: string[]
  // collect information on these elements (size, etc)
  uibox: UIBoxesType
  // location of mouse in dragged object
  grabpos: UIPosType
}

export const initUIGraph = function
() : UIGraphType {
  return {
      list: []
    , grabpos: { x: 0, y: 0 }
    , uibox: {}
    }
}
