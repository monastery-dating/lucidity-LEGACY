// FileStorageHelper runs on the window process.
// This helper runs on the main process.
import { ComponentType } from '../../Graph/types/ComponentType'
import { exportDoc } from '../../Graph/helper/GraphParser'
import { FileChanged } from './types'

declare var require: any
const { ipcMain, dialog } = require ( 'electron' )
const fs = require ( 'fs' )
const path = require ( 'path' )
const sanitize = require ( 'sanitize-filename' )

interface FileCache {
  [ key: string ]: string | boolean
}

interface StringMap {
  [ key: string ]: string
}

interface SceneCache {
  scene?: ComponentType
  // path to source
  files: FileCache
  // ino to path ( detect FS rename )
  inop: StringMap
  // block.id to path ( detect editor rename )
  bidp: StringMap
}

interface SceneCaches {
  [ key: string ]: SceneCache
}

let sceneCacheById: SceneCaches = {}
let readCache: SceneCache
let writeCache: SceneCache

// Latest project and scene saved to fs
const projectCache = { json: '', name: '' }

// User selected project and library paths
// FIXME !!! "open project" and "select library" (where is default lib path ?)
let projectPath: string
let libraryPath = '/Users/gaspard/git/lucidity.library/components'

export const start = () => {

  ipcMain.on ( 'open-project', ( event ) => {
    // User can choose a project
  })

  ipcMain.on ( 'selected-project', ( event, path ) => {
    // User chose a recent project
    selectedProject ( path, event.sender )
  })

  ipcMain.on ( 'select-project', ( event, path ) => {
    // TODO
    // Must select a ".lucy" file
    // and reply with 'selected-directory'
    dialog.showOpenDialog
    ( { properties: [ 'openDirectory', 'createDirectory' ]
    }, function (files) {
      if (files) event.sender.send('selected-directory', files)
    })
    //selectedProjectPath ( path, event.sender )
  })

  ipcMain.on ( 'select-directory', () => {
    // TODO
    // This is used when someone creates a new project
    // Must select a folder and reply with 'selected-directory'
    // selectedProjectPath ( path, event.sender )
  })

  ipcMain.on
  ( 'project-changed'
  , ( event, project: ComponentType ) => {
      // project graph
      try {
        updateGraph
        ( [ projectPath ]
        , project
        , sceneCacheById [ project._id ]
        )
      }
      catch ( err ) {
        event.sender.send ( 'error', err.message )
      }
    }
  )

  ipcMain.on
  ( 'scene-changed'
  , ( event, scene: ComponentType ) => {
      // scenes
      try {
        updateGraph
        ( [ projectPath, 'scenes' ]
        , scene
        , sceneCacheById [ scene._id ]
        )
      }
      catch ( err ) {
        event.sender.send ( 'error', err.message )
      }
    }
  )

  ipcMain.on ( 'save-component', ( event, component ) => {
    // Save component to library
  })

  /* TODO: optimize with:
  ipcMain.on ( 'source-changed', ( event, { blockId, source } ) => {

  })
  */
}

const stat =
( path: string ): any => {
  try {
    return fs.statSync ( path )
  }
  catch ( err ) {
    return null
  }
}

const updateGraph =
( paths: string[]
, scene: ComponentType
, cache: SceneCache
) => {
  // prepare path
  writeCache = { files: {}, inop: {}, bidp: {} }
  let basepath = paths [ 0 ]
  for ( let i = 1; i < paths.length; ++i ) {
    basepath = makeFolder ( basepath, paths [ i ] )
  }

  if ( !cache ) {
    const cache: SceneCache = { scene, files: {}, inop: {}, bidp: {} }
    readCache = cache
    writeCache = cache
    exportDoc ( scene, basepath, saveFile, makeFolder )
    sceneCacheById [ scene._id ] = cache
  }
  else {
    const oscene = cache.scene
    if ( oscene.name !== scene.name ) {
      // move file
      rename
      ( basepath
      , `${oscene.name}.lucy`
      , `${scene.name}.lucy`
      , cache
      )
      // move folder
      rename
      ( basepath
      , oscene.name
      , scene.name
      , cache
      )
    }

    readCache = cache
    writeCache = Object.assign ( {}, readCache, { files: {} } )
    exportDoc ( scene, basepath, saveFile, makeFolder )

    // we must remove unused files.
    // longest paths first
    const keys = Object.keys ( readCache.files ).sort ( ( a, b ) => a < b ? 1 : -1 )
    for ( const p of keys ) {
      if ( ! writeCache.files [ p ] ) {
        // remove old file
        const s = stat ( p )
        if ( !s ) {
          // noop
        } else if ( s.isFile () ) {
          fs.unlinkSync ( p )
          console.log ( '[remove] ' + p )
        } else if ( s.isDirectory () ) {
          // only remove empty folders that we created
          const files = fs.readdirSync ( p )
          if ( files.length === 0 ) {
            fs.rmdirSync ( p )
          }
        }
        else {
          // error. FIXME: ignore ?
        }
      }
    }
    cache.scene = scene
    cache.files = writeCache.files
  }
}

const saveFile =
( base: string, name: string, source: string, blockId: string ): void => {
  const oldp = readCache.bidp [ blockId ]
  const p = path.resolve ( base, sanitize ( name ) )
  const c = readCache.files [ p ]
  if ( c === source ) {
    // not changed
    writeCache.files [ p ] = source
    return
  }

  const s = stat ( p )
  if ( !s || s.isFile () ) {
    if ( !c && oldp ) {
      // move (path not in cache but known previous path)
      fs.renameSync ( oldp, p )
      console.log ( '[move  ] ' + oldp + '-->' + p )
      if ( readCache.files [ oldp ] !== source ) {
        // source also changed
        fs.writeFileSync ( p, source, 'utf8' )
        console.log ( '[write ] ' + p )
      }
    }
    else {
      // changed file
      fs.writeFileSync ( p, source, 'utf8' )
      console.log ( '[write ] ' + p )
    }

    writeCache.bidp [ blockId ] = p
    writeCache.files [ p ] = source
    const s = stat ( p )
    writeCache.inop [ String ( s.ino ) ] = p
  }
  else {
    // not a file
    throw `Cannot save graph source to '${p}' (not a file).`
  }
}

const makeFolder =
( base: string, name: string ): string => {
  const p = path.resolve ( base, sanitize ( name ) )
  const s = stat ( p )
  if ( !s ) {
    fs.mkdirSync ( p )
    console.log ( '[mkdir ] ' + p )
  }
  else if ( !s.isDirectory () ) {
    // error
    throw `Cannot save graph to '${p}' (not a folder).`
  }
  writeCache.files [ p ] = true
  return p
}

let watcher

const selectedProject =
( projectpath: string
, sender: any
) => {
  const basepath = path.dirname ( projectpath )
  projectPath = basepath
  // clear cache
  sceneCacheById = {}
  // TODO: push scenes into db with importDoc ==> doc
  // TODO: push project content into db

  // clear old watcher
  if ( watcher ) {
    watcher.close ()
  }
  // watch new path
  watcher = fs.watch
  ( basepath
  , { persistent: true
    , recursive: true // FIXME: not avail on linux. We need to add each file..
    }
  , ( event, filename ) => {
      const p = path.resolve ( basepath, filename )
      const s = stat ( p )
      if ( !s || !s.isFile () ) {
        // ignore
        return
      }
      // Do we know this file ?
      let cache, source, oldp
      const ino = String ( s.ino )

      for ( const k in sceneCacheById ) {
        cache = sceneCacheById [ k ]
        source = cache.files [ p ]
        if ( source ) {
          // found file
          break
        }
        else {
          oldp = cache.inop [ ino ]
          if ( oldp ) {
            break
          }
        }
      }
      if ( oldp ) {
        // rename
        const scene = cache.scene
        delete cache.files [ oldp ]
        cache.files [ p ] = source
        cache.inop [ ino ] = p
        const bidp = cache.bidp
        for ( const k in bidp ) {
          if ( bidp [ k ] === oldp ) {
            bidp [ k ] = p
            break
          }
        }
        const names = filename.split ( '/' )
        const msg: FileChanged =
        { ownerType: scene.type
        , _id: scene._id
        , path: oldp.substr ( basepath.length + 1 )
        , op: 'rename'
        , name: filename.split ( '/' ).pop ()
        }
        sender.send ( 'file-changed', msg )
      }
      else if ( source ) {
        const src = fs.readFileSync ( p, 'utf8' )
        if ( source === src ) {
          // noop
        }
        else {
          // changed
          const scene = cache.scene
          cache.files [ p ] = source
          const msg: FileChanged =
          { ownerType: scene.type
          , _id: scene._id
          , path: filename
          , op: 'changed'
          , source: src
          }
          sender.send ( 'file-changed', msg )
        }
      }
      else {
        console.log ( event, 'not known', p )
      }
      // if filename === path, (moved)
      // we must call selectedProjectPath to
      // recreate watch.
    }
  )
}

const rename =
( basepath: string
, oldname: string
, newname: string
, cache
) => {
  const from = path.resolve ( basepath, sanitize ( oldname ) )
  const to = path.resolve ( basepath, sanitize ( newname ) )
  const sfrom = stat ( from )
  const sto = stat ( to )
  if ( sfrom && sfrom.isDirectory () && !sto ) {
    // move
    fs.renameSync ( from, to )
    console.log ( '[rename] ' + from + ' --> ' + to )
    // update cache
    const oldCache = cache.files
    const newCache = {}
    const froml = from.length
    for ( const p in oldCache ) {
      const np = path.resolve ( to, p.substr ( froml ) )
      newCache [ np ] = oldCache [ p ]
    }
    const bidp = cache.bidp
    for ( const k in bidp ) {
      const p = bidp [ k ]
      const np = path.resolve ( to, p.substr ( froml ) )
      bidp [ k ] = np
    }
    const inop = cache.inop
    for ( const k in inop ) {
      const p = inop [ k ]
      const np = path.resolve ( to, p.substr ( froml ) )
      inop [ k ] = np
    }
    cache.files = newCache
  }
  else if ( sfrom && sfrom.isFile () && !sto ) {
    fs.renameSync ( from, to )
    console.log ( '[rename] ' + from + ' --> ' + to )
  }
}
