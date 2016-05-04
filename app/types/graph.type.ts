import { NodeType } from './node.type'

export interface NodeMapType {
  [ id: string ]: NodeType
}

export interface LinkMapType {
  [ id: string ]: LinkType
}

export interface LinkType {
  id: string // id of the Node
  parent?: string // id of the Node's parent (null for root)
  children: string[] // ids of children
}

export interface GraphType {
  nodes: NodeMapType
  links: LinkMapType
}
