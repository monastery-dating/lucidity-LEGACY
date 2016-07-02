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
  const p = resolve ( basepath, filename )
  const s = stat ( p )
  if ( !s || !s.isFile () ) {
    // ignore
    return
  }

  // Do we know this file ?
  let id = cache.pathToId [ p ]
  let oldp
  if ( !id && eventType !== 'library-changed' ) {
    // try to grab from regexp
    const re = fileRe.exec ( p )
    if ( re ) {
      // file moved
      id = re [ 1 ]
      debug ( 'mole', id, p )
      oldp = cache.idToPath [ id ]
      if ( !oldp ) {
        const msg = `Unknown element '${id}' (not in graph).`
        console.log ( msg )
        sender.send ( 'error', msg )
        return
      }
      const s = stat ( oldp )
      if ( s ) {
        const msg = `Duplicate block id '${id}' (${p} and ${oldp}).`
        console.log ( msg )
        sender.send ( 'error', msg )
        return
      }
      cacheEntry ( cache, id, p )

      const oldname = getName ( oldp )
      const newname = getName ( p )
      if ( oldname != newname ) {
        // rename
        const msg: FileChanged =
        { type: comp.type
        , _id: comp._id
        , blockId: id
        , op: 'rename'
        , name: newname
        }
        debug ( 'fs.rename', id, p )
        sender.send ( eventType, msg )
      }
    }
  }

  if ( !id ) {
    // Not known in app

    if ( eventType === 'library-changed' ) {
      // New component
      const source = readFileSync ( p, 'utf8' )
      const name = getName ( p, true )
      if ( name ) {
        const msg: FileChanged =
        { type: 'component'
        , _id: makeId ()
        , op: 'new'
        , name
        , source
        }
        cacheEntry ( cache, msg._id, p, source )
        debug ( 'fs.new', msg._id, p )
        sender.send ( eventType, msg )
      }
      else {
        const msg = `Cannot rename (invalid filename '${p}').`
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
    const source = readFileSync ( p, 'utf8' )
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
      debug ( 'fs.src', id, p )
      cacheEntry ( cache, id, p, source )
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
      debug ( 'fs.src', id, p )
      cacheEntry ( cache, id, p, source )
      sender.send ( eventType, msg )
    }
  }

}
