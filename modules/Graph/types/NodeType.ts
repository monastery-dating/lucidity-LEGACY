export interface NodeByIdType {
  [ id: string ]: NodeType
}

export interface NodeType {
  id: string     // id of the Link
  _rev?: string   // DB doc revision
  parent?: string // link id of the parent (null for root)
  children: string[] // link ids of children
}
