import { GraphType } from '../Graph'

// A scene is what a project is composed of but it's also
// what we store in the library with type "component"
export interface SceneType {
  _id: string
  _rev?: string
  type: string // 'scene' or 'component'
  name: string
  graph: GraphType
  // selected block in graph
  blockId?: string
}

export interface SceneByIdType {
  [ key: string ]: SceneType
}
