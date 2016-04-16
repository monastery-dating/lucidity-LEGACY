import { BoxType, initBox } from './box.type'
import { nextGraphId } from './graph.helper'

export interface GraphType {
  [ key: string ]: BoxType
}

export const initGraph = function () : GraphType {
  const id = nextGraphId ( {} )
  return { [ id ]: initBox () }
}
