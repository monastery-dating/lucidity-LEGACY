import { BoxType, initBox } from './box.type'
import { nextGraphId } from './graph.helper'

export interface BoxesType {
  [ id: string ]: BoxType
}

export interface GraphType {
  type?: string
  boxes: BoxesType
}

export const initGraph = function () : GraphType {
  const id = nextGraphId ( { boxes: {} } )
  return { boxes: { [ id ]: initBox () } }
}
