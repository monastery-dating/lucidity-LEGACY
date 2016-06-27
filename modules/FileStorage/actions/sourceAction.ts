import { ActionContextType } from '../../context.type'
import { GraphType, Immutable as IM } from '../../Graph'
import { updateGraphSource } from '../../Graph/helper/GraphHelper'

export const sourceAction =
( { state
  , input: { path, op, source }
  , output
  } : ActionContextType
) => {
  console.log ( 'source-changed', path, op, source )

/*
  const odoc = state.get ( select.ownerType )
  const ograph: GraphType = odoc.graph

  updateGraphSource ( ograph, select.id, source, ( errors, graph ) => {
    if ( errors ) {
      output.error ( { errors } )
    }
    else {
      const doc = IM.update ( odoc, 'graph', graph )
      output.success ( { doc } )
    }
  })
  */
}

sourceAction [ 'async' ] = true
