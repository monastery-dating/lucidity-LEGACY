import { GraphType, initGraph } from '../../common/graph.type'
import { UIGraphType, initUIGraph } from '../../common/uigraph.type'

export interface FilesStoreType {
  graph: GraphType
  uigraph: UIGraphType
}

export const initFilesStore = function
() : FilesStoreType {
  return {
      graph: initGraph ()
    , uigraph: initUIGraph ()
    }
}
