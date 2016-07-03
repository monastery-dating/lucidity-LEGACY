import { CacheType, cacheEntry, cacheRemove, debug, dirname, getName, makeName, stat, join, resolve, readFileSync, sanitize, unlinkSync, writeFileSync, renameSync } from './FileStorageUtils'
import { ComponentType } from '../../Graph/types/ComponentType'
import { FileChanged } from './types'

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
  for ( const blockId in blocksById ) {
    // Here cache is in sync with FS
    const block = blocksById [ blockId ]
    const source = idToSource [ blockId ]

    if ( !source ) {
      // New file in app
      const name = makeName ( block )
      const filepath = resolve ( basepath, name )
      const s = stat ( filepath )
      if ( s && !s.isFile () ) {
        // Very unlikely to have a folder name 'some.name-bid.ts'
        sender.send ( 'error', `Cannot create '${filepath}' (path exists and is not afile).`)
      }
      else {
        debug ( 'write', blockId, name )
        cacheEntry ( cache, blockId, name, block.source )
        writeFileSync ( filepath, block.source, 'utf8' )
      }
    }

    else {
      // File exists in FS and app
      const appname = makeName ( block )
      const filename = idToPath [ blockId ]
      const fsname = filename.split ( '/' ).pop ()

      if ( appname !== fsname ) {
        // rename
        if ( appfirst ) {
          // appname is the truth
          const subp2 = join ( dirname ( filename ), appname )
          debug ( 'rename', blockId, subp2 )
          renameSync ( resolve ( basepath, filename ), resolve ( basepath, subp2 ) )
          cacheEntry ( cache, blockId, subp2  )
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
            debug ( 'fs.rename', blockId, filename )
            cacheEntry ( cache, blockId, filename )
            sender.send ( 'file-changed', msg )
          }
          else {
            const msg = `Cannot rename (invalid filename '${filename}').`
            console.log ( msg )
            sender.send ( 'error', msg )
          }
        }
      }

      if ( source === block.source ) {
        // noop
        // debug ( 'same', blockId, p )
      }

      else {
        // FS source is different from app
        if ( appfirst ) {
          // update file system
          debug ( 'write', blockId, filename )
          cacheEntry ( cache, blockId, filename, block.source )
          writeFileSync ( resolve ( basepath, filename ), block.source, 'utf8' )
        }
        else {
          // update app
          const msg: FileChanged =
          { type: comp.type
          , _id: comp._id
          , op: 'changed'
          , blockId
          , source
          }

          debug ( 'fs.src', blockId, filename )
          cacheEntry ( cache, blockId, filename, source )
          sender.send ( 'file-changed', msg )
        }
      }

    }

  }

  for ( const blockId in idToPath ) {
    if ( blockId === 'lucidity' ) { continue }
    const block = blocksById [ blockId ]

    if ( !block ) {
      // File not in app: remove in FS
      const filename = idToPath [ blockId ]
      debug ( 'remove', blockId, filename )
      cacheRemove ( cache, blockId )
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
  const filepath = resolve ( cache.path, name )
  const s = stat ( filepath )
  if ( !s || s.isFile () ) {
    const json = JSON.stringify ( doc, null, 2 )
    if ( !cache.json && s ) {
      cache.json = readFileSync ( filepath, 'utf8' )
    }

    if ( cache.json === json ) {
      return
    }
    cache.json = json
    debug ( 'write', null, name )
    cacheEntry ( cache, 'lucidity', name, json )
    writeFileSync ( filepath, json, 'utf8' )
  }
  else {
    sender.send ( 'error', `Could not save graph structure ('${filepath}' is not a file).` )
  }
}
