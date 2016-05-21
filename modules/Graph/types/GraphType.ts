import { BlockByIdType } from './BlockType'
import { NodeByIdType } from './NodeType'

export interface GraphType {
  blocksById: BlockByIdType
  nodesById: NodeByIdType
  // list of link ids
  nodes: string[]
}


/* With database, I think storing the graph should be:
  /data/scene/[_id]/nodes == array of node ids
  /data/node/[_id]        == stores graph node
  /data/block/[_id]       == stores script + info
*/
