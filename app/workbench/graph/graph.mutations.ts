import { GraphStoreType } from './graph.store.type'
import { GraphType } from '../common/graph.type'
import { nextGraphId } from '../common/graph.helper'
import { BoxType, FileType } from '../common/box.type'
import { uimap } from '../common/uimap'
import { merge } from '../../util/index'

// Mutations
export class GraphAdd {
  constructor
  ( public name: string
  , public after: string
  , public position: number
  ) {}

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

// This is all our app can do on files
export type GraphAction = GraphAdd
