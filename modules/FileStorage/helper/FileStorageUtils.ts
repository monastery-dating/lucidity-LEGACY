import { makeId } from '../../Factory/makeId'
declare var require: any
const fs = require ( 'fs' )
interface Path {
  resolve ( a: string, b?: string, c?: string ): string
  join ( a: string, b?: string, c?: string ): string
  dirname ( a: string ): string
}
const pathlib: Path = require ( 'path' )
export const dirname = pathlib.dirname
export const mkdirSync = fs.mkdirSync
export const readdirSync = fs.readdirSync
export const readFileSync = fs.readFileSync
export const renameSync = fs.renameSync
export const resolve = pathlib.resolve
export const join = pathlib.join
export const sanitize = require ( 'sanitize-filename' )
export const unlinkSync = fs.unlinkSync
export const watch = fs.watch
export const writeFile = fs.writeFile
export const writeFileSync = fs.writeFileSync

const WHITE = '                   '
const MSG_LEN = 10

export const debug =
( msg: string
, blockId: string
, path: string
) => {
  if ( msg.length < MSG_LEN ) {
    msg = msg + WHITE.substr ( 0, MSG_LEN - msg.length )
  }
  console.log ( `[${ msg }] (${ blockId || '--' }) ${ path }` )
}


interface StringMap {
  [ key: string ]: string
}

export interface CacheType {
  path: string
  watcher?: any
  compName: string
  pathToId: StringMap
  idToPath: StringMap
  idToSource: StringMap
}

export const clearCache =
( o ): CacheType => {
  const c: CacheType = o
  if ( c.watcher ) {
    c.watcher.close ()
    c.watcher = null
  }
  c.path = null
  c.pathToId = {}
  c.idToPath = {}
  c.idToSource = {}
  return c
}

export const stat =
( path: string ): any => {
  try {
    return fs.statSync ( path )
  }
  catch ( err ) {
    return null
  }
}


export const fileRe = /([^\/]+)-(b\d+)\.([^\.]+)$/
export const compRe = /([^\/]+)\.ts$/
export const unCacheRe = /^([^\-]+)-(.+)$/
export const makeCacheId =
( name: string
, blockId: string
, ext: string
): string => {
  if ( ext === 'ts' ) {
    return blockId
  }
  else {
    return `${ blockId }-${ name }.${ ext }`
  }
}

export const unCacheId =
( cacheId: string
): { blockId: string, filename: string } => {
  const re = unCacheRe.exec ( cacheId )
  if ( re ) {
    return { blockId: re [ 1 ], filename: re [ 2 ] }
  }
  else {
    // cacheId === blockId
    return null
  }
}

// FIXME: What about components with multiple sources ?

export const compName =
( name: string
): string => {
  return `${ sanitize ( name ) }.ts`
}

export const makeName =
( name: string
, blockId: string
, ext: string
, iscomp?: boolean
): string => {
  return `${ sanitize ( name ) }-${ blockId }.${ext}`
}

export const getName =
( path: string
, iscomp?: boolean
): string => {
  const re = iscomp ? compRe.exec ( path ) : fileRe.exec ( path )
  if ( re ) {
    return re [ 1 ]
  }
  return null
}

// Just grab all files with a blockId and store info.
export const buildCache =
( cache: CacheType
, filename: string = ''
) => {
  const filepath = resolve ( cache.path, filename )
  const s = stat ( filepath )

  if ( !s ) { return }

  if ( s.isFile () ) {
    const re = fileRe.exec ( filename )
    if ( re ) {
      const cacheId = makeCacheId ( re [ 1 ], re [ 2 ], re [ 3 ] )
      const source = readFileSync ( filepath, 'utf8' )
      cacheEntry ( cache, cacheId, filename, source )
    }
  }

  else if ( s.isDirectory () ) {
    const children = readdirSync ( filepath )
    for ( const child of children ) {
      const subfilename = join ( filename, child )
      buildCache ( cache, subfilename )
    }
  }
}

export const cacheEntry =
( cache: CacheType
, cacheId: string
, path: string
, source?: string
) => {
  const oldp = cache.idToPath [ cacheId ]
  if ( oldp && oldp !== path ) {
    // debug ( 'cache >', cacheId, oldp )
    delete cache.pathToId [ oldp ]
  }
  // debug ( 'cache +', cacheId, path )
  cache.pathToId [ path ] = cacheId
  cache.idToPath [ cacheId ] = path
  if ( source !== undefined ) {
    cache.idToSource [ cacheId ] = source
  }
}

export const cacheRemove =
( cache: CacheType
, blockId: string
) => {
  const oldp = cache.idToPath [ blockId ]
  if ( oldp ) {
    // debug ( 'cache -', blockId, oldp )
    delete cache.pathToId [ oldp ]
    delete cache.idToPath [ blockId ]
    delete cache.idToSource [ blockId ]
  }
}
