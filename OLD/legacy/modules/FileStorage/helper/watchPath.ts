import { ComponentType } from '../../Graph/types/ComponentType'
import { CacheType, debug, cacheEntry, cacheRemove, fileRe, makeCacheId, getName, readFileSync, resolve, stat, unCacheId, watch } from './FileStorageUtils'
import { FileChanged } from './types'
import { makeId } from '../../Factory/makeId'
import { rootBlockId } from '../../Block/BlockType'

export interface Watcher {
  close (): void
}

interface Sender {
  send ( ...any ): void
}

export const watchPath =
( path: string
, comp: ComponentType
, cache: CacheType
, eventType: 'file-changed' | 'library-changed'
, sender: Sender
, watcher: Watcher
): Watcher => {
  if ( watcher ) {
    watcher.close ()
  }

  debug ( 'watch', null, path )

  return watch
  ( path
  , { persistent: true
    , recursive: true // FIXME: not avail on linux. We need to add each file..
    }
  , ( event, filename ) => {
      try {
        handleEvent ( path, comp, sender, cache, eventType, filename )
      }
      catch ( err ) {
        console.log ( 'fsworker error', err )
        sender.send ( 'error', err )
      }
    }
  )
}

const handleEvent =
( basepath: string
, comp: ComponentType
, sender: Sender
, cache: CacheType
, eventType: 'file-changed' | 'library-changed'
, filename: string
) => {
  const filepath = resolve ( basepath, filename )
  const s = stat ( filepath )
  if ( !s || !s.isFile () ) {
    // ignore
    return
  }

  // Do we know this file ?
  let cacheId = cache.pathToId [ filename ]
  let oldfilename
  if ( !cacheId && eventType !== 'library-changed' ) {
    // try to grab from regexp
    const re = fileRe.exec ( filename )
    if ( re ) {
      // file moved
      cacheId = makeCacheId ( re [ 1 ], re [ 2 ], re [ 3 ] )
      debug ( 'move', cacheId, filename )
      oldfilename = cache.idToPath [ cacheId ]
      if ( !oldfilename ) {
        const err = `Unknown element '${cacheId}' (not in graph).`
        console.log ( err )
        sender.send ( 'error', err )
        return
      }
      const s = stat ( resolve ( basepath, oldfilename ) )
      if ( s ) {
        const err = `Duplicate block cacheId '${cacheId}' (${filename} and ${oldfilename}).`
        console.log ( err )
        sender.send ( 'error', err )
        return
      }
      cacheEntry ( cache, cacheId, filename )

      const ext = re [ 3 ]

      const oldname = getName ( oldfilename )
      const newname = re [ 2 ]
      if ( oldname != newname && ext === 'ts' ) {
        // rename
        const msg: FileChanged =
        { type: comp.type
        , _id: comp._id
        , blockId: cacheId
        , op: 'rename'
        , name: newname
        }
        debug ( 'fs.rename', cacheId, filename )
        sender.send ( eventType, msg )
      }
    }
  }

  if ( !cacheId ) {
    // Not known in app

    if ( eventType === 'library-changed' ) {
      // New component
      const source = readFileSync ( filepath, 'utf8' )
      const name = getName ( filename, true )
      if ( name ) {
        const msg: FileChanged =
        { type: 'component'
        , _id: makeId ()
        , op: 'new'
        , name
        , source
        }
        cacheEntry ( cache, msg._id, filename, source )
        debug ( 'fs.new', msg._id, filename )
        sender.send ( eventType, msg )
      }
      else {
        const err = `Cannot rename (invalid filename '${filename}').`
        console.log ( err )
        sender.send ( 'error', err )
      }
    }

    else {
      // Ignore new files outside of library
      debug ( 'ignore', null, filename )

      // if filename === path, (moved)
      // we must call selectProjectPath to
      // recreate watch.
    }
  }

  else {
    const csource = cache.idToSource [ cacheId ]
    const source = readFileSync ( filepath, 'utf8' )
    if ( csource === source ) {
      // noop
      // debug ( 'same', cacheId, p )
    }

    else if ( eventType === 'library-changed' ) {
      // changed source in library
      const msg: FileChanged =
      { type: 'component'
      , _id: cacheId
      , blockId: rootBlockId
      , op: 'changed'
      , source
      }
      debug ( 'fs.src', cacheId, filename )
      cacheEntry ( cache, cacheId, filename, source )
      sender.send ( eventType, msg )
    }
    else {
      // changed file in project or scene
      const extraSource = unCacheId ( cacheId )
      let msg: FileChanged

      if ( extraSource ) {
        msg =
        { type: comp.type
        , _id: comp._id
        , blockId: extraSource.blockId
        , sourceName: extraSource.filename
        , op: 'changed'
        , source
        }

      }

      else {
        msg =
        { type: comp.type
        , _id: comp._id
        , blockId: cacheId
        , op: 'changed'
        , source
        }
      }

      debug ( 'fs.src', cacheId, filename )
      cacheEntry ( cache, cacheId, filename, source )
      sender.send ( eventType, msg )
    }
  }

}
