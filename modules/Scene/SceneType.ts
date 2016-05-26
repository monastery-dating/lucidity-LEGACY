import { GraphType } from '../Graph'

export interface SceneType {
  _id: string
  _rev?: string
  type: string
  name: string
  graph: GraphType
}

export interface SceneByIdType {
  [ key: string ]: SceneType
}
