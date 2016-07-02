import { CacheType, cacheEntry, cacheRemove, debug, dirname, getName, makeName, stat, resolve, readFileSync, sanitize, unlinkSync, writeFileSync, renameSync } from './FileStorageUtils'
import { ComponentType } from '../../Graph/types/ComponentType'
import { FileChanged } from './types'

// Any file not in cache: create
// Different source in cache: update app
// File in cache not in app: remove
export const updateFiles =
( path: string
, cache: CacheType
, comp: ComponentType
, sender
, appfirst?: boolean
) => {
  const blocksById = comp.graph.blocksById
  const idToSource = cache.idToSource
  const idToPath = cache.idToPath
  const pathToId = cache.pathToId
  for ( const blockId in blocksById ) {
    // Here cache is in sync with FS
    const block = blocksById [ blockId ]
    const source = idToSource [ blockId ]

    if ( !source ) {
      // New file in app
      const p = resolve ( path, makeName ( block ) )
      const s = stat ( p )
      if ( s && !s.isFile () ) {
        // Very unlikely to have a folder name 'some.name-bid.ts'
        sender.send ( 'error', `Cannot create '${p}' (path exists and is not afile).`)
      }
      else {
        debug ( 'write', blockId, p )
        cacheEntry ( cache, blockId, p, block.source )
        writeFileSync ( p, block.source, 'utf8' )
      }
    }

    else {
      // File exists in FS and app
      const appname = makeName ( block )
      const p = idToPath [ blockId ]
      const fsname = p.split ( '/' ).pop ()

      if ( appname !== fsname ) {
        // rename
        if ( appfirst ) {
          // appname is the truth
          const p2 = resolve ( dirname ( p ), appname )
          debug ( 'rename', blockId, p2 )
          renameSync ( p, p2 )
          cacheEntry ( cache, blockId, p2  )
        }
        else {
          // fsname is the truth
          const name = getName ( p )
          if ( name ) {
            const msg: FileChanged =
            { type: comp.type
            , _id: comp._id
            , op: 'rename'
            , blockId
            , name
            }
            debug ( 'fs.rename', blockId, p )
            cacheEntry ( cache, blockId, p )
            sender.send ( 'file-changed', msg )
          }
          else {
            const msg = `Cannot rename (invalid filename '${p}').`
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
          const name = `${ sanitize ( block.name ) }-${ blockId }.ts`
          debug ( 'write', blockId, p )
          cacheEntry ( cache, blockId, p, block.source )
          writeFileSync ( p, block.source, 'utf8' )
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

          debug ( 'fs.src', blockId, p )
          cacheEntry ( cache, blockId, p, source )
          sender.send ( 'file-changed', msg )
        }
      }

    }

  }

  for ( const blockId in idToPath ) {
    const block = blocksById [ blockId ]

    if ( !block ) {
      // File not in app: remove in FS
      const p = idToPath [ blockId ]
      debug ( 'remove', blockId, p )
      cacheRemove ( cache, blockId )
      unlinkSync ( p )
    }
  }
}

export const saveLucidityJson =
( path: string
, cache: CacheType
, comp: ComponentType
, sender
) => {
  // create lucidity.json
  const doc = Object.assign ( {}, comp )
  delete doc.graph.blocksById
  delete doc.scenes
  delete doc._rev

  const p = resolve ( path, 'lucidity.json')
  const s = stat ( p )
  if ( !s || s.isFile () ) {
    const json = JSON.stringify ( doc, null, 2 )
    if ( !cache.json && s ) {
      cache.json = readFileSync ( p, 'utf8' )
    }

    if ( cache.json === json ) {
      return
    }
    cache.json = json
    debug ( 'write', null, p )
    cacheEntry ( cache, 'lucidity', p, json )
    writeFileSync ( p, json, 'utf8' )
  }
  else {
    sender.send ( 'error', `Could not save graph structure ('${p}' is not a file).` )
  }
}
