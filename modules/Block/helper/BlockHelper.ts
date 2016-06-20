import { BlockType, BlockByIdType, BlockSourceInfo
       , BlockTypeChanges, PlaybackMetaType } from '../BlockType'
import { compileCode } from '../../Code/helper/CodeHelper'
import { CompilerError } from '../../Code'
import { Immutable as IM } from '../../Graph/helper/Immutable'
import { Block, Meta } from 'lucidity'
import * as stringhash from 'string-hash'

declare var require: any
const DEFAULT_SOURCE = require ( './default/block.js.txt')

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

export const mainBlock =
(): Promise<BlockType> => {
  return createBlock ( 'main', MAIN_SOURCE )
}

export const createBlock =
( name: string
, source: string
): Promise<BlockType> => {
  const newobj =
  { id: rootBlockId
  , name: name || 'main'
  , source: source || DEFAULT_SOURCE
  }

  return processSource ( newobj )
}

export const nameBlock =
( block: BlockType
, name: string
): BlockType => {
  return Object.freeze
  ( Object.assign ( {}, block, { name } ) )
}

export const updateBlock =
( block: BlockType
, changes: BlockTypeChanges
): Promise<BlockType> => {
  const newobj = Object.assign ( {}, block, changes )

  if ( changes.source ) {
    return processSource ( newobj )
  }

  else {
    return Promise.resolve ( Object.freeze ( newobj ) )
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

export const extractMeta =
( exported: Block ): PlaybackMetaType => {
  const meta = <PlaybackMetaType> {}
  const emeta = exported.meta || <Meta>{}
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
  if ( exported.update && !emeta.update ) {
    meta.isvoid = true
  }
  else if ( emeta.update ) {
    meta.update = normalizeType ( emeta.update )
  }
  return meta
}

const processSource =
( block: BlockType
): Promise<BlockType> => {
  const p = new Promise<BlockType>
  ( ( resolve, reject ) => {

  compileCode
  ( block.source
  , ( { js, scrub, errors } ) => {
      if ( !errors ) {
        const codefunc = new Function ( 'exports', js )
        // We now run the code.
        try {
          const exported: any = {}
          codefunc ( exported )

          // FIXME: validate meta ?
          const meta = extractMeta ( exported )
          const b = Object.assign ( block, { js, scrub, meta } )
          resolve ( b )
        }
        catch ( err ) {
          console.log ( err )
          const error: CompilerError =
          { message: err.message
          , line: 0
          , ch: 0
          }
          reject ( [ error ] )
        }
      }
      else {
        reject ( errors )
      }
    })
  })

  return p
}
