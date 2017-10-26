/*
import { ActionContextType } from '../../context.type'
import { GraphType, Immutable as IM } from '../../Graph'

export const arrowAction =
( { state
  , input: { arrow: { nodeId, ownerType, closed } }
  , output
  } : ActionContextType
) => {

  const doc = IM.update
  ( state.get ( [ ownerType ] )
  , 'graph', 'nodesById', nodeId
  , ( node ) => Object.assign ( {}, node, { closed } )
  )

  output ( { doc } )
}
*/