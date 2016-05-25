import { ActionContextType } from '../../context.type'
import { GraphType, GraphHelper, BlockHelper } from '../../Graph'

export const addAction =
( { state
  , input: { pos, parentId }
  , output
  } : ActionContextType
) => {
  const scene = state.get ( [ 'scene' ] )
  const child = BlockHelper.create ( 'empty.Block', '' )
  const graph =
  GraphHelper.insert ( scene.graph, parentId, pos, child )

  const sceneupdate = Object.assign ( {}, scene, { graph } )

  output ( { docs: [ child, sceneupdate ] } )
}
