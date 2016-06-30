import { makeId } from '../../Factory/makeId'
declare var require: any
const fs = require ( 'fs' )
interface Path {
  resolve ( a: string, b?: string, c?: string ): string
}
const path: Path = require ( 'path' )
export const resolve = path.resolve
export const mkdirSync = fs.mkdirSync
export const writeFile = fs.writeFile
export const writeFileSync = fs.writeFileSync
export const readdirSync = fs.readdirSync
export const readFileSync = fs.readFileSync
export const unlinkSync = fs.unlinkSync
export const renameSync = fs.renameSync
export const watch = fs.watch
export const sanitize = require ( 'sanitize-filename' )

interface StringMap {
  [ key: string ]: string
}

export interface CacheType {
  path: string
  json?: string
  watcher?: any
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
  c.json = null
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


export const fileRe = /-(b\d+)\.ts$/
export const nameRe = /^(.+)-b\d+\.ts$/
export const compRe = /^(.+)\.ts$/

interface NamedType {
  name: string
  id?: string
}

export const makeName =
( elem: NamedType
, iscomp?: boolean
): string => {
  const name = sanitize ( elem.name )
  return iscomp ? `${ name }.ts` : `${ name }-${ elem.id }.ts`
}

export const getName =
( path: string
, iscomp?: boolean
): string => {
  const paths = path.split ( '/' )
  const last = paths [ paths.length - 1 ]
  const re = iscomp ? compRe.exec ( last ) : nameRe.exec ( last )
  if ( re ) {
    return re [ 1 ]
  }
  return null
}

// Just grab all files with a blockId and store info.
export const buildCache =
( path: string
, cache: CacheType
) => {
  const s = stat ( path )

  if ( !s ) { return }

  if ( s.isFile () ) {
    const re = fileRe.exec ( path )
    if ( re ) {
      const blockId = re [ 1 ]
      const source = readFileSync ( path, 'utf8' )
      cache.pathToId [ path ] = blockId
      cache.idToPath [ blockId ] = path
      cache.idToSource [ blockId ] = source
    }
  }

  else if ( s.isDirectory () ) {
    const children = readdirSync ( path )
    for ( const child of children ) {
      const subp = resolve ( path, child )
      buildCache ( subp, cache )
    }
  }
}
