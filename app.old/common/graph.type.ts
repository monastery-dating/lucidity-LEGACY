import { BoxType, initBox } from './box.type'
import { rootGraphId } from './graph.helper'

export interface BoxesType {
  [ id: string ]: BoxType
}

export interface GraphType {
  type?: string
  boxes: BoxesType
}

export const initGraph = function ( box?: BoxType ) : GraphType {
  const b = box || initBox ()
  return { boxes: { [ rootGraphId ]: b } }
}
