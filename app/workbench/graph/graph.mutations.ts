import { GraphStoreType } from './graph.store.type'
import { GraphType } from '../common/graph.type'
import { nextGraphId } from '../common/graph.helper'
import { BoxType, FileType } from '../common/box.type'
import { uimap } from '../common/uimap'
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
    console.log ( state )
    const uigraph = uimap ( this.graph )

    return { graph: this.graph, uigraph }
  }
}

export class GraphAdd extends GraphAction {
  constructor
  ( public name: string
  , public after: string
  , public position: number
  ) {
    super ()
  }

  mutate
  ( state: GraphStoreType ) : GraphStoreType {
      // ======= FIXME ======
      console.assert ( false, 'GraphAdd not implemented yet.' )

      // add a file to graph
      const fileId = nextGraphId ( state.graph )
      // We typecast to FileType so that 'next' is mandatory and we
      // do not get errors with the merge call.
      const after = <FileType> state.graph [ this.after ]

      const newFile : FileType =
      { name: this.name
      , in: []
      , out: null
      , next: after ? after.next : null
      }

      const changes = {}
      changes [ this.after ] = merge ( after, { next: fileId } )
      changes [ fileId ] = newFile

      const graph = merge ( state.graph, changes )

      // compute uigraph
      const uigraph = uimap ( graph )

      return { graph, uigraph }
  }
}
