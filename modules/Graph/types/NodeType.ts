export interface NodeByIdType {
  [ id: string ]: NodeType
}

export interface NodeType {
  id: string         // node id
  blockId: string    // _id of the related block

  parent?: string    // node id of the parent (null for root)
  children: string[] // node ids of children

  // Contains a message on why the node is invalid (if it is). This
  // can be because of invalid type in graph.
  // When a node is invalid, it is not rendered.
  invalid?: string[]
}
