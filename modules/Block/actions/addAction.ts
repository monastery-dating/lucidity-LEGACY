import { ActionContextType } from '../../context.type'
import { GraphHelper } from '../../Graph'
import { BlockHelper } from '../helper/BlockHelper'

export const addAction =
( { state
  , input: { pos, parentId }
  , output
  } : ActionContextType
) => {
  const scene = state.get ( [ 'scene' ] )
  const child = BlockHelper.create ( 'new block' )
  const graph =
  GraphHelper.insert ( scene.graph, parentId, pos, child )

  const sceneupdate = Object.assign ( {}, scene, { graph } )

  // triger name edit after object save
  state.set ( [ '$factory', 'editing' ], child._id )

  output ( { docs: [ child, sceneupdate ], doc: child } )
}
