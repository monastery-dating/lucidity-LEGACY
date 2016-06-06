import { BlockType, BlockByIdType, BlockSourceInfo
       , BlockTypeChanges } from '../BlockType'
import { makeId } from '../../Factory'
import * as ts from 'typescript'
import { Immutable as IM } from '../../Graph'

declare var require: any
const MAIN_SOURCE    = require ( './default/main.js.txt' )
const DEFAULT_SOURCE = require ( './default/block.js.txt')

export module BlockHelper {

  export const main =
  (): BlockType => {
    return create ( 'main', MAIN_SOURCE )
  }

  export const copy =
  ( block: BlockType
  ) : BlockType => {
    const info = processSource ( block.source )

    return IM.merge
    ( { _id: makeId ()
      , type: 'block'
      , name: block.name
      , source: block.source
      }
    , info
    )
  }

  export const create =
  ( name: string
  , source: string = DEFAULT_SOURCE
  ) : BlockType => {
    const info = processSource ( source )

    return IM.merge
    ( { _id: makeId ()
      , type: 'block'
      , name
      , source
      }
    , info
    )
  }

  export const update =
  ( block: BlockType
  , changes: BlockTypeChanges
  ) : BlockType => {
    const newobj = IM.merge ( block, changes )

    if ( changes.source ) {
      const info = processSource ( changes.source )
      return IM.merge ( newobj, info )
    }

    else {
      return newobj
    }
  }

  const processSource =
  ( source: string
  ) : BlockSourceInfo => {
    let js = ''
    try {
      js = ts.transpile ( source )
      const codefunc = new Function ( 'exports', js )
      // We now run the code. The exports is the cache.
      const exports: any = {}
      codefunc ( exports )
      const render = exports.render
      if ( !render ) {
        return { input: []
               , js
               , output: null
               , init: exports.init ? true : false
               }
      }

      const input = []
      for ( let i = 0; i < render.length - 1; ++i ) {
        // FIXME: detect input type
        input.push ( 'string' )
      }

      // FIXME: output type
      const output = 'string'

      return { input
             , js
             , output
             , init: exports.init ? true : false
             }
    }
    catch ( err ) {
      // FIXME: what do we do with bad code ?
      // Should we keep old source and js ?
      return { input: [ 'string', 'string' ]
             , js
             , output: 'string'
             , init: false
             }
    }
  }

}
