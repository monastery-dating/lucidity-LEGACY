import { CacheType, dirname, getName, makeName, stat, resolve, readFileSync, sanitize, unlinkSync, writeFileSync, renameSync } from './FileStorageUtils'
import { ComponentType } from '../../Graph/types/ComponentType'
import { FileChanged } from './types'

const debug = ( ...args ) => {
  console.log ( args.join ("\n") )
}

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
        idToPath [ blockId ] = p
        pathToId [ p ] = blockId
        idToSource [ blockId ] = block.source
        debug ( '[write ] ' + p )
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
          debug ( '[rename] ' + p2 )
          renameSync ( p, p2 )
          idToPath [ blockId ] = p2
          delete pathToId [ p ]
          pathToId [ p2 ] = blockId
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
            debug ( '[fs.nam] ' + p )
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
        // debug ( '[same  ] ' + p )
      }

      else {
        // FS source is different from app
        if ( appfirst ) {
          // update file system
          const name = `${ sanitize ( block.name ) }-${ blockId }.ts`
          const p = idToPath [ blockId ]
          idToSource [ blockId ] = block.source
          debug ( '[write ] ' + p )
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

          debug ( '[fs.nam] ' + p )
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
      debug ( '[remove] ' + p )
      unlinkSync ( p )
      delete idToSource [ blockId ]
      delete idToPath [ blockId ]
      delete pathToId [ p ]
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
    debug ( '[write ] ' + p )
    writeFileSync ( p, json, 'utf8' )
  }
  else {
    sender.send ( 'error', `Could not save graph structure ('${p}' is not a file).` )
  }
}
