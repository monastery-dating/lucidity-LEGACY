import { makeId } from '../../Factory'
import { ComponentType, GraphType, rootNodeId } from '../../Graph'

export const createComponent =
( graph: GraphType
, _id?: string
): ComponentType => {
  const node = graph.nodesById [ rootNodeId ]
  const block = graph.blocksById [ node.blockId ]
  return { _id: _id || makeId ()
         , name: block.name
         , type: 'component'
         , graph
         }
}
