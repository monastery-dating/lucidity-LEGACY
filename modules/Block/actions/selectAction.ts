import { ActionContextType } from '../../context.type'
import { GraphType, Immutable as IM } from '../../Graph'

export const selectAction =
( { state
  , input: { doc, docs, id, ownerType }
  , output
  } : ActionContextType
) => {
  const elem = state.get ( [ ownerType ] )

  if ( doc ) {
    const graph: GraphType = doc.graph
    state.set ( [ '$blockId' ], graph.blockId )
  }

  else {
    // simple select
    state.set ( [ '$blockId' ], id )
  }
}
