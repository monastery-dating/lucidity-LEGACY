export interface NodeByIdType {
  [ id: string ]: NodeType
}

export interface NodeType {
  id: string         // node id
  blockId: string    // _id of the related block
  
  parent?: string    // node id of the parent (null for root)
  children: string[] // node ids of children
}
