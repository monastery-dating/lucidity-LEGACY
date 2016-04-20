import { FilesStoreType } from './files.store.type'
import { GraphType } from '../../common/graph.type'
import { nextGraphId } from '../../common/graph.helper'
import { BoxType, FileType } from '../../common/box.type'
import { uimap } from '../../common/uimap'
import { merge } from '../../util/index'

// Mutations
// Base class
export class FilesAction {
  // dummy mutate method
  mutate
  ( state: FilesStoreType ) : FilesStoreType {
    return state
  }
}

export class FilesInit extends FilesAction {
  constructor
  ( public graph: GraphType
  ) {
    super ()
  }

  mutate
  ( state: FilesStoreType ) : FilesStoreType {
    const uigraph = uimap ( this.graph )

    return { graph: this.graph, uigraph }
  }
}

export class FilesAdd extends FilesAction {
  constructor
  ( public name: string
  , public after: string // where to insert file
  ) {
    super ()
  }

  mutate
  ( state: FilesStoreType ) : FilesStoreType {
      // add a file to graph
      const fileId = nextGraphId ( state.graph )
      // We typecast to FileType so that 'next' is mandatory and we
      // do not get errors with the merge call.
      const after = <FileType> state.graph [ this.after ]

      const newFile : FileType =
      { name: this.name
      , type: 'Block'
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
