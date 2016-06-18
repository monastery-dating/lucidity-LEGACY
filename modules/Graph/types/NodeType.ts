export interface NodeByIdType {
  [ id: string ]: NodeType
}

export interface NodeType {
  id: string         // node id
  blockId: string    // _id of the related block

  parent?: string    // node id of the parent (null for root)
  children: string[] // node ids of children

  //// UI
  closed?: boolean // children not shown

  //// Computed
  // When a node is invalid, it is not initialized nor updated.
  invalid?: boolean

  // Slot connection errors (also renders the node invalid)
  serr?: string[]
  // Context errors
  cerr?: string[]
  // compiled children if the node has typed information for them. This can be different from children if the node steals from its descendants.
  childrenm?: string[]
  // all 'isvoid' children accessible. Only set if this block has
  // meta.all set to true
  all?: string[]
}
