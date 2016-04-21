import { GraphStoreType } from './graph.store.type'
import { GraphType } from '../../common/graph.type'
import { nextGraphId, removeInGraph } from '../../common/graph.helper'
import { BoxType, FileType, initBox } from '../../common/box.type'
import { uimap } from '../../common/uimap'
import { merge } from '../../util/index'

// Mutations
// Base class
export class GraphAction {
  name: string

  constructor () {
    this.name = 'GraphAction'
  }

  // dummy mutate method
  mutate
  ( state: GraphStoreType ) : GraphStoreType {
    return state
  }
}

export class GraphInit extends GraphAction {
  constructor
  ( public graph: GraphType
  ) {
    super ()
  }

  mutate
  ( state: GraphStoreType ) : GraphStoreType {
    const uigraph = uimap ( this.graph )

    return { graph: this.graph, uigraph }
  }
}

export class GraphClick extends GraphAction {
  constructor
  ( public boxid: string
  ) {
    super ()
    console.log ( 'GraphClick', boxid )
  }

  mutate
  ( state: GraphStoreType ) : GraphStoreType {
      const graph = removeInGraph ( state.graph, this.boxid )
      console.log ( graph )

      const uigraph = uimap ( graph, null, state.uigraph )

      return { graph, uigraph }
  }

}

export class GraphGhost extends GraphAction {
  constructor
  ( public box: BoxType
  , public x: number
  , public y: number
  ) {
    super ()
    console.log ( 'new graph ghost' )
  }

  mutate
  ( state: GraphStoreType ) : GraphStoreType {
      console.log ( 'mutate graph ghost' )
      // TODO: we could optimize this id
      const nextId = nextGraphId ( state.graph )

      // compute uigraph with the ghost
      const uigraph = uimap ( state.graph, null, null, this )

      return { graph: state.graph, uigraph }
  }
}
