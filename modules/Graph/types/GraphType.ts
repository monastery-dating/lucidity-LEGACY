import { BlockByIdType } from './BlockType'
import { NodeByIdType } from './NodeType'

// This is what we store in scene
export interface GraphType {
  nodesById: NodeByIdType
  nodes: string[]
}

// This is what we pass to uimap
export interface GraphWithBlocksType extends GraphType {
  blocksById: BlockByIdType
}


/* With database, I think storing the graph should be:
  /data/scene/[_id]/nodes == array of node ids
  /data/node/[_id]        == stores graph node
  /data/block/[_id]       == stores script + info
*/
