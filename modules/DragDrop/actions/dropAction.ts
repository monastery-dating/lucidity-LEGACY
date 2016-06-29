import { BlockByIdType } from '../../Block'
import { Immutable as IM, rootNodeId } from '../../Graph'
import { ComponentHelper } from '../../Library'
import { ActionContextType } from '../../context.type'
import { DragStartType, DragDropType } from '../'

const dragp = [ '$dragdrop', 'drag' ]
const movep = [ '$dragdrop', 'move' ]
const dropp = [ '$dragdrop', 'drop' ]

export const dropAction =
( { state
  , input
  , output
  } : ActionContextType
) => {
  const drag: DragStartType = state.get ( dragp )
  if ( !drag ) { return }
  const drop: DragDropType  = state.get ( dropp )
  const copy = drag.copy || ( drop && drop.copy )

  state.unset ( dragp )
  state.unset ( movep )

  let odoc
  if ( drag.ownerType !== 'library' && ! copy ) {
    odoc = IM.update
    ( state.get ( [ drag.ownerType ] )
    , 'graph', drag.rgraph
    )
  }

  if ( !drop ) {
    // Not dropping on a valid zone.
    if ( odoc ) {
      // Remove
      state.set ( [ '$factory', odoc.type, 'close' ], true )
      output.success ( { doc: odoc } )
    }

    return
  }

  if ( drop.ownerType === 'library' ) {
    // Do we have a block with same name in the library ?
    const node = drag.dgraph.nodesById [ rootNodeId ]
    const name = drag.dgraph.blocksById [ node.blockId ].name

    const library: BlockByIdType = state.get ( [ 'data', 'component' ] )
    let doc
    for ( const k in library ) {
      const b = library [ k ]
      if ( b.name === name ) {
        // replace
        doc = Object.assign ( {}, b, { graph: drag.dgraph } )
        break
      }
    }

    if ( !doc ) {
      // new component
      doc = ComponentHelper.create ( drag.dgraph )
    }

    state.set ( [ '$factory', doc.type, 'close' ], true )
    output.success ( { doc } )
  }

  else {
    let doc = state.get ( [ drop.ownerType ] )
    doc = IM.update ( doc, 'graph', drop.graph )
    state.set ( [ '$factory', doc.type, 'close' ], true )

    const docs = [ doc ]
    if ( drop.ownerType !== drag.ownerType && odoc ) {
      // transfer from one graph to another
      // also change origin

      state.set ( [ '$factory', odoc.type, 'close' ], true )
      docs.push ( odoc )
    }
    output.success ( { docs } )
  }
}
