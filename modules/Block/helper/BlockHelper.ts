import { BlockType, BlockByIdType, BlockSourceInfo
       , BlockTypeChanges } from '../BlockType'
import * as ts from 'typescript'
import { Immutable as IM } from '../../Graph/helper/Immutable'
import { PlaybackHelper } from '../../Playback'

declare var require: any
const DEFAULT_SOURCE = require ( './default/block.js.txt')

const defaultMeta = PlaybackHelper.defaultMeta

export module BlockHelper {
  export const MAIN_SOURCE = require ( './default/main.js.txt' )

  export const nextBlockId =
  ( blocksById: BlockByIdType
  ) : string => {
    let n : number = 0
    while ( blocksById [ `b${n}` ] ) {
      n += 1
    }
    return `b${n}`
  }

  export const rootBlockId = nextBlockId ( {} )

  export const main =
  (): BlockType => {
    return create ( 'main', MAIN_SOURCE )
  }

  export const create =
  ( name: string
  , source: string = DEFAULT_SOURCE
  ) : BlockType => {
    const info = processSource ( source )

    return IM.merge
    ( { id: rootBlockId
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
      // We now run the code.
      const exports: any = {}
      codefunc ( exports )
      const input = []
      let output = null

      const render = exports.render
      let meta = Object.assign ( {}, defaultMeta, exports.meta || {} )
      if ( meta.main ) {
        meta.provide = PlaybackHelper.mainContextProvide
      }

      if ( render ) {
        const ins = meta.input || []
        for ( let i = 0; i < render.length - 1; ++i ) {
          input.push ( ins [ i ] || 'any' )
        }

        output = meta.output || 'any'
      }

      return { input
             , js
             , output
             , meta
             }
    }
    catch ( err ) {
      console.log ( err )
      return { input: []
             , js
             , output: null
             , meta: defaultMeta
             }
    }
  }

}
