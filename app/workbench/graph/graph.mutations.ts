import { GraphStoreType } from './graph.store.type'
import { GraphType } from '../../common/graph.type'
import { nextGraphId, removeInGraph } from '../../common/graph.helper'
import { BoxType, FileType, GhostBoxType, initBox } from '../../common/box.type'
import { UIBoxType } from '../../common/uibox.type'
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

export class GraphAdd extends GraphAction {
  constructor
  () {
    super ()
  }

  mutate
  ( state: GraphStoreType ) : GraphStoreType {
      const g = state.uigraph.dropghost
      if ( !g ) {
        console.error ( `No element set in uigraph.dropghost.` )
        return
      }

      const parent = state.graph.boxes [ g.parentid ]
      if ( !parent ) {
        console.error ( `Cannot add element: missing parent '${g.parentid}'` )
        return
      }

      const link = []
      const plink = parent.link
      for ( let i = 0; i < plink.length; i += 1 ) {
        if ( i === g.linkpos ) {
          link.push ( g.boxid )
        }
        link.push ( plink [ i ] )
      }
      const newparent = merge ( parent, { link } )
      const boxes = merge
      ( state.graph.boxes
      , { [ g.parentid ]: newparent
        , [ g.boxid ]: g.box
        }
      )

      const graph = merge
      ( state.graph , { boxes } )

      console.log ( 'GraphAdd', g.boxid )

      const uigraph = uimap ( graph, null, state.uigraph )

      return { graph, uigraph }
  }
}

export class GraphClick extends GraphAction {
  constructor
  ( public boxid: string
  ) {
    super ()
  }

  mutate
  ( state: GraphStoreType ) : GraphStoreType {
      const graph = removeInGraph ( state.graph, this.boxid )

      const uigraph = uimap ( graph, null, state.uigraph )

      return { graph, uigraph }
  }

}

export class GraphGhost extends GraphAction {
  constructor
  ( public box: BoxType
  , public uibox: UIBoxType
  , public x: number
  , public y: number
  ) {
    super ()
  }

  mutate
  ( state: GraphStoreType ) : GraphStoreType {
      // TODO: we could optimize this id
      const nextId = nextGraphId ( state.graph )

      // compute uigraph with the ghost
      const uigraph = uimap ( state.graph, null, null, this )

      return { graph: state.graph, uigraph }
  }
}
