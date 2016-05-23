import { ActionContextType } from '../../context.type'
import { GraphWithBlocksType } from '../types'
import { GraphHelper, BlockHelper } from '../helper'

export const addAction =
( { state
  , input: { pos, parentId }
  } : ActionContextType
) => {
  const g: GraphWithBlocksType = state.get ( [ 'graph' ] )
  const b = g.blocksById
  const child = BlockHelper.create ( 'empty.Block', '' )
  const ng =
  GraphHelper.insert
  ( g
  , parentId
  , pos
  , child
  )

  const nb = Object.assign ( {}, b, { [ child._id ]: child } )
  state.set
  ( [ 'graph' ]
  , { nodes: ng.nodes
    , nodesById: ng.nodesById
    , blocksById: nb
    }
  )
}
