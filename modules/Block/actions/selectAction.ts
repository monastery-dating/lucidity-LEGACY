import { ActionContextType } from '../../context.type'
import { GraphType, Immutable as IM } from '../../Graph'

export const selectAction =
( { state
  , input: { doc, docs, id, ownerType }
  , output
  } : ActionContextType
) => {
  const sel = state.get ( [ '$block' ] )

  if ( doc ) {
    const graph: GraphType = doc.graph
    if ( sel ) {
      // do not select if block is hidden
      state.set ( [ '$block' ], { id: graph.blockId, ownerType } )
    }
  }

  else {
    // simple select
    if ( sel && id == sel.id && ownerType == sel.ownerType ) {
      // toggle
      state.unset ( [ '$block' ] )
    }
    else {
      state.set ( [ '$block' ], { id, ownerType } )
    }
  }
}
