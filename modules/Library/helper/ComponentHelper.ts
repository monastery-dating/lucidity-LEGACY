import { makeId } from '../../Factory'
import { SceneType } from '../../Scene'
import { GraphType, rootNodeId } from '../../Graph'

export module ComponentHelper {
  export const create =
  ( graph: GraphType
  ): SceneType => {
    const node = graph.nodesById [ rootNodeId ]
    const block = graph.blocksById [ node.blockId ]
    return { _id: makeId ()
           , name: block.name
           , type: 'component'
           , graph
           }
  }
}
