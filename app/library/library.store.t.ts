// BUG in TS for Atom ?: cannot name this file
// library.store.type
import { GraphType, initGraph } from '../common/graph.type'
import { UIGraphType, initUIGraph } from '../common/uigraph.type'

export interface LibraryStoreType {
  graph: GraphType
  uigraph: UIGraphType
}

export const initLibraryStore = function
() : LibraryStoreType {
  return  { graph: initGraph ()
          , uigraph: initUIGraph ()
          }
}
