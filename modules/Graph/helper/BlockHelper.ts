import { BlockType, BlockByIdType, BlockIOType
       , BlockTypeChanges } from '../types'
import { Immutable as IM } from './immutable'



export module BlockHelper {

  export const create =
  ( name: string
  , source: string = ''
  ) : BlockType => {
    const typeInfo = getType ( source )


    return IM.merge
    ( { _id: new Date ().toISOString ()
      , type: 'block'
      , name
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
