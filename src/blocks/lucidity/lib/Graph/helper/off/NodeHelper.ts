import { NodeType, NodeByIdType } from '../types'
import { Immutable as IM } from './Immutable'

export const createNode =
( blockId: string
, id: string
, parent: string | undefined
, children?: string[]
): NodeType => {

  return <NodeType> Object.freeze // (??)
  ( { id
    , blockId
    , parent
    , children: Object.freeze ( children || [] )
    }
  )
}
