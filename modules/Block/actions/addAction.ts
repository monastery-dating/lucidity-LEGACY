import { ActionContextType } from '../../context.type'
import { GraphHelper } from '../../Graph'
import { BlockHelper } from '../helper/BlockHelper'

export const addAction =
( { state
  , input: { pos, parentId, ownerType }
  , output
  } : ActionContextType
) => {
  const owner = state.get ( [ ownerType ] )
  const child = BlockHelper.create ( 'new block' )
  const graph =
  GraphHelper.insert ( owner.graph, parentId, pos, child )

  const ownerupdate = Object.assign ( {}, owner, { graph } )

  // triger name edit after object save
  state.set ( [ '$factory', 'editing' ], child._id )

  output ( { docs: [ child, ownerupdate ], doc: child } )
}
