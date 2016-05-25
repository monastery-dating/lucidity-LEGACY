import { ActionContextType } from '../../context.type'

export const selectAction =
( { state
  , input: { _id }
  , output
  } : ActionContextType
) => {
  const user = state.get ( [ 'user' ] )

  // simple select
  const doc = Object.assign ( {}, user, { blockId: _id } )
  output ( { doc } )
}
