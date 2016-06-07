import { BlockByIdType } from '../../Block'
import { NodeByIdType } from './NodeType'

// This is what we store in a scene or library "component"
export interface GraphType {
  blocksById: BlockByIdType
  nodesById: NodeByIdType
  // last changed blockId (used to help select block)
  blockId?: string
}
