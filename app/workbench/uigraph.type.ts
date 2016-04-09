import { UIBoxType } from './uibox.type'

export interface UIBoxesType {
  [ key: string ]: UIBoxType
}

export interface UIGraphType {
  // collect the list of ids to draw
  list: string[]
  // collect information on these elements (size, etc)
  uibox: UIBoxesType
}
