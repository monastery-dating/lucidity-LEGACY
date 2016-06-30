import { ComponentType } from '../../Graph/types/ComponentType'
import { buildCache, CacheType, clearCache, getName, makeName, stat, resolve, mkdirSync, writeFileSync, readdirSync, readFileSync, unlinkSync } from './FileStorageUtils'
import { watchPath, Watcher } from './watchPath'
import { updateFiles, saveLucidityJson } from './updateFiles'
import { rootBlockId } from '../../Block/BlockType'
import { FileChanged } from './types'
import { makeId } from '../../Factory/makeId'

const libraryCache = clearCache ( {} )

const tsRe = /\.ts$/

export const loadLibrary =
( event
, path: string
) => {
  clearCache ( libraryCache )
  libraryCache.path = path
  event.sender.send ( 'done' )
}

export const loadComponents =
( event: any
, components: ComponentType[]
) => {
  const path = libraryCache.path
  const sender = event.sender
  if ( components ) {
    // Build cache and create new files
    try {
      for ( const comp of components ) {
        const block = comp.graph.blocksById [ rootBlockId ]
        if ( Object.keys ( comp.graph.blocksById ).length === 1
             && block
             && ( !block.sources || Object.keys ( block.sources ).length === 0 ) ) {
          const name = makeName ( comp, true )
          // single file component
          const p = resolve ( path, name )
          const s = stat ( p )
          if ( !s ) {
            writeFileSync ( p, block.source, 'utf8' )
            libraryCache.idToPath [ comp._id ] = p
            libraryCache.pathToId [ p ] = comp._id
            libraryCache.idToSource [ comp._id ] = block.source
          }
          else if ( !s.isFile () ) {
            const msg = `Cannot export component ('${p}' is not a writable).`
            console.log ( msg )
            sender.send ( 'error', msg )
          }
          else {
            // source compare will happen on path traverse
            libraryCache.idToPath [ comp._id ] = p
            libraryCache.pathToId [ p ] = comp._id
            libraryCache.idToSource [ comp._id ] = block.source
          }
        }
        else {
          const msg = `Complex component export not implemented ('${comp.name}' not exported).`
          console.log ( msg )
          sender.send ( 'error', msg )
        }
      }
    }
    catch ( err ) {
      console.log ( err )
      sender.send ( 'error', err.message )
    }
  }
  else {
    // Parse library and update app if new file/source.
    const children = readdirSync ( path )
    for ( const child of children ) {
      const p = resolve ( path, child )
      const s = stat ( p )
      if ( !s ) { continue } // should never happen
      if ( s.isFile () ) {
        if ( tsRe.test ( p ) ) {
          // found ts file
          let _id = libraryCache.pathToId [ p ]
          const source = readFileSync ( p, 'utf8' )
          const csource = libraryCache.idToSource [ _id ]
          if ( source === csource ) {
            // noop: same
          }
          else {
            // new or update file
            if ( !_id ) {
              _id = makeId ()
            }
            const name = getName ( path )
            const msg: FileChanged =
            { type: 'component'
            , _id
            , op: 'new'
            , source
            , name
            }
            // update cache
            libraryCache.pathToId [ p ] = _id
            libraryCache.idToPath [ _id ] = path
            libraryCache.idToSource [ _id ] = source
            sender.send ( 'library-changed', msg )
          }
        }
      }
      else if ( s.isDirectory () ) {
        // FIXME deal with more complex components...
        // test if exist in cache, ...
      }
    }

    // watch library
    libraryCache.watcher = watchPath
    ( libraryCache.path
    , null // no component
    , libraryCache
    , 'library-changed'
    , event.sender
    , libraryCache.watcher
    )
  }

  sender.send ( 'done' )
}

export const componentChanged =
( event
, comp: ComponentType
) => {
  const path = libraryCache.path
  const name = makeName ( comp, true )
  const p = resolve ( path, name )
  const s = stat ( p )

  if ( comp._deleted ) {
    if ( s && s.isFile () ) {
      unlinkSync ( p )
      delete libraryCache.idToPath [ comp._id ]
      delete libraryCache.pathToId [ p ]
      delete libraryCache.idToSource [ comp._id ]
    }
    else {
      const msg = `Could not remove '${comp.name}' (not a file).`
      console.log ( msg )
      event.sender ( 'error', msg )
    }
  }

  else {
    const block = comp.graph.blocksById [ rootBlockId ]
    if ( Object.keys ( comp.graph.blocksById ).length === 1
         && block
         && ( !block.sources || Object.keys ( block.sources ).length === 0 ) ) {
      // single file component
      if ( !s || s.isFile () ) {
        writeFileSync ( p, block.source, 'utf8' )
        libraryCache.idToPath [ comp._id ] = p
        libraryCache.pathToId [ p ] = comp._id
        libraryCache.idToSource [ comp._id ] = block.source
      }
      else {
        const msg = `Cannot export component ('${p}' is not a writable).`
        console.log ( msg )
        event.sender ( 'error', msg )
      }
    }
    else {
      const msg = `Complex component export not implemented ('${comp.name}' not exported).`
      console.log ( msg )
      event.sender ( 'error', msg )
    }
  }
}
