import { ActionContextType } from '../../context.type'
import { GraphWithBlocksType } from '../types'
import { GraphHelper, BlockHelper } from '../helper'

export const selectAction =
( { state
  , input: { id }
  } : ActionContextType
) => {
  const g: GraphWithBlocksType = state.get ( [ 'graph' ] )
  const nodesById  = g.nodesById
  const blocksById = g.blocksById

  const node = nodesById [ id ]
  state.set
  ( [ 'block' ], blocksById [ node.blockId ] )
}
