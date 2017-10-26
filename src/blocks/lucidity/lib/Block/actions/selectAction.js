/*
import { ActionContextType } from '../../context.type'
import { GraphType, Immutable as IM } from '../../Graph'

export const selectAction =
( { state
  , input: { doc, select, selectDone }
  , output
  } : ActionContextType
) => {
  const sel = state.get ( [ '$block' ] )

  if ( select ) {
    // simple select
    if ( select.id === '' ||
         ( sel && select.id == sel.id && select.ownerType == sel.ownerType )
       ) {
      // close
      state.unset ( [ '$block' ] )
    }
    else {
      const editing = state.get ( [ '$factory', 'block', 'name' ] )
      if ( typeof editing === 'string' && !selectDone ) {
        // writing changes, we must save this name before
        // selecting new element
        output.error ( { value: editing, selectDone: true } )
        // select will be called after name save op.
      }
      else {
        state.set ( [ '$block' ], select )
      }
    }
  }

  else if ( doc ) {
    const graph: GraphType = doc.graph
    if ( sel ) {
      // only select if block is visible
      state.set ( [ '$block' ],
      { id: graph.blockId, ownerType: doc.type } )
    }
  }
}
*/