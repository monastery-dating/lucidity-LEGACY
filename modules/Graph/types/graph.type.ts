import { NodeByIdType } from './node.type'

export interface LinkByIdType {
  [ id: string ]: LinkType
}

export interface LinkType {
  id: string // id of the Node
  parent?: string // id of the Node's parent (null for root)
  children: string[] // ids of children
}

export interface GraphType {
  nodesById: NodeByIdType
  linksById: LinkByIdType
  // list of node ids
  nodes: string[]
}


/* With database, I think storing the graph should be:
  /data/scene/[_id]/nodes     == array of node ids
  /data/node/[_nodeid]        == stores script + info
  /data/link/[_nodeid]-link   == stores link
*/
