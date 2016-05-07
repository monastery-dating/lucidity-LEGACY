import { NodeMapType } from '../types/node.type'

export interface LibraryType {
  path: string
  nodesById: NodeMapType
  nodes: string[]
}
