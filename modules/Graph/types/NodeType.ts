export interface NodeByIdType {
  [ id: string ]: NodeType
}

export interface NodeType {
  id: string         // node id
  blockId: string    // _id of the related block

  parent?: string    // node id of the parent (null for root)
  children: string[] // node ids of children

  // When a node is invalid, it is not rendered.
  invalid?: boolean

  // Slot connection errors (also renders the node invalid)
  serr?: string[]
  // Context errors
  cerr?: string[]
}
