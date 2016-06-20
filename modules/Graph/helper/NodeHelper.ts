import { NodeType, NodeByIdType } from '../types'
import { Immutable as IM } from './Immutable'

export const nextNodeId =
( nodesById: NodeByIdType
) : string => {
  let n : number = 0
  while ( nodesById [ `n${n}` ] ) {
    n += 1
  }
  return `n${n}`
}

export const rootNodeId = nextNodeId ( {} )

export const createNode =
( blockId: string
, id: string
, parent: string
, children?: string[]
) : NodeType => {

  return Object.freeze
  ( { id
    , blockId
    , parent
    , children: Object.freeze ( children || [] )
    }
  )
}
