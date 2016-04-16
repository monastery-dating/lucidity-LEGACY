import { GraphType, initGraph } from '../../common/graph.type'
import { UIGraphType, initUIGraph } from '../../common/uigraph.type'

export interface GraphStoreType {
  graph: GraphType
  uigraph: UIGraphType
}

export const initGraphStore = function () : GraphStoreType {
  return {
      graph: initGraph ( )
    , uigraph: initUIGraph ()
    }
}
