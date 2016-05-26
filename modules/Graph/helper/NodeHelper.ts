import { NodeType, NodeByIdType } from '../types'
import { Immutable as IM } from './Immutable'

export module NodeHelper {

  export const nextNodeId =
  ( nodesById: NodeByIdType
  ) : string => {
    let n : number = 0
    while ( nodesById [ `id${n}` ] ) {
      n += 1
    }
    return `id${n}`
  }

  export const rootNodeId = nextNodeId ( {} )

  export const create =
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

}
