import { CacheType, cacheEntry, cacheRemove, debug, dirname, getName, makeName, makeCacheId, stat, join, resolve, readFileSync, sanitize, unlinkSync, unCacheId, writeFileSync, renameSync } from './FileStorageUtils'
import { extraSourceRe } from '../../Block/BlockType'
import { ComponentType } from '../../Graph/types/ComponentType'
import { FileChanged } from './types'

interface SourceInfoType {
  appname: string
  source: string
  blockId: string
}

interface SourceInfoTypeMap {
  [ cacheId: string ]: SourceInfoType
}

// Any file not in cache: create
// Different source in cache: update app
// File in cache not in app: remove
export const updateFiles =
( cache: CacheType
, comp: ComponentType
, sender
, appfirst?: boolean
) => {
  const blocksById = comp.graph.blocksById
  const idToSource = cache.idToSource
  const idToPath = cache.idToPath
  const pathToId = cache.pathToId
  const basepath = cache.path
  const sources: SourceInfoType[] = []

  for ( const blockId in blocksById ) {
    const block = blocksById [ blockId ]
    if ( !block.name ) {
      continue
    }
    const cacheId = makeCacheId ( block.name, block.id, 'ts' )
    sources [ cacheId ] =
    { appname: makeName ( block.name, block.id, 'ts' )
    , source: block.source
    , blockId: block.id
    }
    const extrasources = block.sources
    if ( extrasources ) {
      for ( const key in extrasources ) {
        const re = extraSourceRe.exec ( key )
        if ( re ) {
          const cacheId = makeCacheId ( re [ 1 ], block.id, re [ 2 ] )
          sources [ cacheId ] =
          { appname: makeName ( re [ 1 ], block.id, re [ 2 ] )
          , source: extrasources [ key ]
          , blockId: block.id
          }
        }
      }
    }
  }

  for ( const cacheId in sources ) {
    // Here cache is in sync with FS
    const sourceInfo = sources [ cacheId ]
    const appname = sourceInfo.appname
    const appsource = sourceInfo.source
    const fssource = idToSource [ cacheId ]
    const blockId = sourceInfo.blockId


    ///// =========== TODO

    if ( !fssource ) {
      // New file in app
      const filepath = resolve ( basepath, appname )
      const s = stat ( filepath )
      if ( s && !s.isFile () ) {
        // Very unlikely to have a folder name 'some.name-bid.ts'
        sender.send ( 'error', `Cannot create '${filepath}' (path exists and is not afile).`)
      }
      else {
        debug ( 'write', cacheId, appname )
        cacheEntry ( cache, cacheId, appname, appsource )
        writeFileSync ( filepath, appsource, 'utf8' )
      }
    }

    else {
      // File exists in FS and app
      const filename = idToPath [ cacheId ]
      const fsname = filename.split ( '/' ).pop ()

      if ( appname !== fsname ) {
        // rename
        if ( appfirst ) {
          // appname is the truth
          const subp2 = join ( dirname ( filename ), appname )
          debug ( 'rename', cacheId, subp2 )
          renameSync ( resolve ( basepath, filename ), resolve ( basepath, subp2 ) )
          cacheEntry ( cache, cacheId, subp2  )
        }
        else {
          // fsname is the truth
          const name = getName ( filename )
          if ( name ) {
            const msg: FileChanged =
            { type: comp.type
            , _id: comp._id
            , op: 'rename'
            , blockId
            , name
            }
            debug ( 'fs.rename', cacheId, filename )
            cacheEntry ( cache, cacheId, filename )
            sender.send ( 'file-changed', msg )
          }
          else {
            const err = `Cannot rename (invalid filename '${filename}').`
            console.log ( err )
            sender.send ( 'error', err )
          }
        }
      }

      if ( fssource === appsource ) {
        // noop
        // debug ( 'same', blockId, p )
      }

      else {
        // FS source is different from app
        if ( appfirst ) {
          // update file system
          debug ( 'write', cacheId, filename )
          cacheEntry ( cache, cacheId, filename, appsource )
          writeFileSync ( resolve ( basepath, filename ), appsource, 'utf8' )
        }
        else {
          // update app

          const extraSource = unCacheId ( cacheId )
          let msg: FileChanged

          if ( extraSource ) {
            msg =
            { type: comp.type
            , _id: comp._id
            , op: 'changed'
            , blockId
            , sourceName: extraSource.filename
            , source: fssource
            }
          }

          else {
            msg =
            { type: comp.type
            , _id: comp._id
            , op: 'changed'
            , blockId
            , source: fssource
            }
          }


          debug ( 'fs.src', cacheId, filename )
          cacheEntry ( cache, cacheId, filename, fssource )
          sender.send ( 'file-changed', msg )
        }
      }

    }

  }

  for ( const cacheId in idToPath ) {
    if ( cacheId.substr ( 0, 1 ) === '/' ) { continue }
    const info = sources [ cacheId ]

    if ( !info ) {
      // File not in app: remove in FS
      const filename = idToPath [ cacheId ]
      debug ( 'remove', cacheId, filename )
      cacheRemove ( cache, cacheId )
      unlinkSync ( resolve ( basepath, filename ) )
    }
  }
}

export const saveLucidityJson =
( cache: CacheType
, comp: ComponentType
, sender
) => {
  // create lucidity.json
  const doc = Object.assign ( {}, comp )
  delete doc.graph.blocksById
  delete doc.scenes
  delete doc._rev

  const name = 'lucidity.json'
  const cacheId = `/${name}`
  const filepath = resolve ( cache.path, name )

  const source = JSON.stringify ( doc, null, 2 )

  const s = stat ( filepath )
  if ( !s || s.isFile () ) {
    const oldsrc = cache.idToSource [ cacheId ]

    if ( oldsrc === source ) {
      return
    }
    debug ( 'write', cacheId, name )
    cacheEntry ( cache, cacheId, name, source )
    writeFileSync ( filepath, source, 'utf8' )
  }
  else {
    sender.send ( 'error', `Could not save graph structure ('${filepath}' is not a file).` )
  }
}

export const saveProjectSettings =
( cache: CacheType
, comp: ComponentType
, sender
) => {
  // create [Project Name].lucy
  const name = `${ sanitize ( comp.name ) }.lucy`
  const oname = `${ sanitize ( cache.compName ) }.lucy`

  const filepath = resolve ( cache.path, '..', name )
  const ofilepath = resolve ( cache.path, '..', oname )
  const ofilepathStat = stat ( ofilepath )
  const filepathStat = stat ( filepath )
  if ( filepathStat && ! filepathStat.isFile () ) {
    // error
    const err = `Cannot create project file '${filepath}' (exists and is not a file).`
    console.log ( err )
    sender.send ( 'error', err )
  }
  else {
    if ( ofilepathStat && ofilepathStat.isFile () ) {
      debug ( 'rename', null, `../${oname}`)
      renameSync ( ofilepath, filepath )
    }
    else if ( !filepathStat ) {
      debug ( 'write', null, `../${name}`)
      writeFileSync ( filepath, '{}', 'utf8' )
    }
  }
  cache.compName = comp.name
}
