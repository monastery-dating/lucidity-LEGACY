import { BlockType, BlockByIdType, BlockSourceInfo
       , BlockTypeChanges, PlaybackMetaType } from '../BlockType'
import * as ts from 'typescript'
import { Immutable as IM } from '../../Graph/helper/Immutable'
import { PlaybackHelper } from '../../Playback'
import { Block, Meta } from '../../Playback/types/lucidity'
import * as stringhash from 'string-hash'

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

  const TypeRe = /^\s*\(([^\)]*)\)\s*:\s*(\S+)\s*$/
  const ArgRe = /^\s*$|^\s*\S+\s*:\s*(\S+)\s*$/
  export const normalizeType =
  ( t: string ): string => {
    if ( !t ) { return null }
    const m = TypeRe.exec ( t )
    if ( !m ) { throw `Invalid type '${t}' (SyntaxError).`}
    const args = []
    const list = m [ 1 ].split ( ',' )
    for ( const e of list ) {
      const a = ArgRe.exec ( e )
      if ( !a ) { throw `Invalid type '${t}' (SyntaxError).`}
      args.push ( a [ 1 ] )
    }
    return `(${ args.join () }):${ m [ 2 ] }`
  }

  export const parseMeta =
  ( exports: Block ): PlaybackMetaType => {
    const meta = <PlaybackMetaType> {}
    const emeta = exports.meta || <Meta>{}
    // expect?: TypeMap
    const expect = emeta.expect
    if ( expect ) {
      meta.expect = expect
    }
    // provide?: TypeMap
    const provide = emeta.provide
    if ( provide ) {
      meta.provide = provide
    }
    const children = emeta.children
    // all?: boolean // set to true if children: 'all'
    if ( emeta.children === 'all' ) {
      meta.all = true
    }
    // children?: number[]
    else if ( Array.isArray ( children ) ) {
      meta.children = children.map ( normalizeType )
    }
    // update?: number // normalized type
    if ( exports.update && !emeta.update ) {
      meta.isvoid = true
    }
    else if ( emeta.update ) {
      meta.update = normalizeType ( emeta.update )
    }
    return meta
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

      const meta = parseMeta ( exports )

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
