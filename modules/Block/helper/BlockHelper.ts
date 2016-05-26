import { BlockType, BlockByIdType, BlockIOType
       , BlockTypeChanges } from '../BlockType'
import { makeId } from '../../Factory'


export module BlockHelper {

  export const create =
  ( name: string
  , source: string = ''
  ) : BlockType => {
    const typeInfo = getType ( source )


    return Object.assign
    ( {}
    , { _id: makeId ()
      , type: 'block'
      , name
      , source
      }
    , typeInfo
    )
  }

  export const update =
  ( block: BlockType
  , changes: BlockTypeChanges
  ) : BlockType => {
    const newobj = Object.assign ( {}, block, changes )

    if ( changes.source ) {
      const typeInfo = getType ( changes.source )
      return Object.assign ( {}, newobj, typeInfo )
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
