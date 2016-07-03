import { ComponentType } from '../../Graph/types/ComponentType'
import { CacheType, debug, cacheEntry, cacheRemove, fileRe, getName, readFileSync, resolve, stat, watch } from './FileStorageUtils'
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
  let id = cache.pathToId [ filename ]
  let oldfilename
  if ( !id && eventType !== 'library-changed' ) {
    // try to grab from regexp
    const re = fileRe.exec ( filename )
    if ( re ) {
      // file moved
      id = re [ 1 ]
      debug ( 'move', id, filename )
      oldfilename = cache.idToPath [ id ]
      if ( !oldfilename ) {
        const msg = `Unknown element '${id}' (not in graph).`
        console.log ( msg )
        sender.send ( 'error', msg )
        return
      }
      const s = stat ( resolve ( basepath, oldfilename ) )
      if ( s ) {
        const msg = `Duplicate block id '${id}' (${filename} and ${oldfilename}).`
        console.log ( msg )
        sender.send ( 'error', msg )
        return
      }
      cacheEntry ( cache, id, filename )

      const oldname = getName ( oldfilename )
      const newname = getName ( filename )
      if ( oldname != newname ) {
        // rename
        const msg: FileChanged =
        { type: comp.type
        , _id: comp._id
        , blockId: id
        , op: 'rename'
        , name: newname
        }
        debug ( 'fs.rename', id, filename )
        sender.send ( eventType, msg )
      }
    }
  }

  if ( !id ) {
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
        const msg = `Cannot rename (invalid filename '${filename}').`
        console.log ( msg )
        sender.send ( 'error', msg )
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
    const csource = cache.idToSource [ id ]
    const source = readFileSync ( filepath, 'utf8' )
    if ( csource === source ) {
      // noop
      // debug ( 'same', id, p )
    }

    else if ( eventType === 'library-changed' ) {
      // changed source in library
      const msg: FileChanged =
      { type: 'component'
      , _id: id
      , blockId: rootBlockId
      , op: 'changed'
      , source
      }
      debug ( 'fs.src', id, filename )
      cacheEntry ( cache, id, filename, source )
      sender.send ( eventType, msg )
    }
    else {
      // changed file in project or scene
      const msg: FileChanged =
      { type: comp.type
      , _id: comp._id
      , blockId: id
      , op: 'changed'
      , source
      }
      debug ( 'fs.src', id, filename )
      cacheEntry ( cache, id, filename, source )
      sender.send ( eventType, msg )
    }
  }

}
