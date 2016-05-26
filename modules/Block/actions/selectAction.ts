import { ActionContextType } from '../../context.type'

export const selectAction =
( { state
  , input: { doc, docs, _id }
  , output
  } : ActionContextType
) => {
  const user = state.get ( [ 'user' ] )

  if ( doc ) {
    const sel = Object.assign ( {}, user, { blockId: doc._id } )
    if ( docs ) {
      output ( { docs: [ ...docs, sel ] } )
    }
    else {
      output ( { docs: [ doc, sel ] } )
    }
  }
  
  else {
    // simple select
    const sel = Object.assign ( {}, user, { blockId: _id } )
    output ( { doc: sel } )
  }
}
