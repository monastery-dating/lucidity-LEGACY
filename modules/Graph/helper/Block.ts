import { BlockType, BlockByIdType, BlockIOType
       , BlockTypeChanges, SlotType } from '../types'
import { Immutable as IM } from './immutable'



export module Block {
  export const nextNodeId =
  ( blocksById: BlockByIdType
  ) : string => {
    let n : number = 0
    while ( blocksById [ `id${n}` ] ) {
      n += 1
    }
    return `id${n}`
  }

  export const rootNodeId = nextNodeId ( {} )

  export const create =
  ( name: string
  , source: string
  , basePath: string
  ) : BlockType => {
    const typeInfo = getType ( source )
    const path = `${basePath}/${name}.ts`

    return IM.merge
    ( { type: 'Node'
      , name
      , path
      , source
      }
    , typeInfo
    )
  }

  export const update =
  ( node: BlockType
  , changes: BlockTypeChanges
  ) : BlockType => {
    const newobj = IM.merge ( node, changes )
    if ( changes.source ) {
      const typeInfo = getType ( changes.source )
      return IM.merge ( newobj, typeInfo )
    }
    else {
      return newobj
    }
  }

  const getType =
  ( source: string
  ) : BlockIOType => {
    // TODO: parse source and read 'render' signature
    return { input: [ 'text:string', 'text:string' ]
           , output: 'text:string'
           , init: false
           }
  }

}
