import { makeId } from '../../Factory'
import { ComponentType, GraphType, rootNodeId } from '../../Graph'

export const createComponent =
( graph: GraphType
): ComponentType => {
  const node = graph.nodesById [ rootNodeId ]
  const block = graph.blocksById [ node.blockId ]
  return { _id: makeId ()
         , name: block.name
         , type: 'component'
         , graph
         }
}
