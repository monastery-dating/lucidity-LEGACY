// FileStorageHelper runs on the window process.
// This helper runs on the main process.
import { ComponentType } from '../../Graph/types/ComponentType'
import { rootBlockId } from '../../Block/BlockType'
import { exportDoc } from '../../Graph/helper/GraphParser'
import { FileChanged, PreferencesType } from './types'

declare var require: any
const { ipcMain, dialog, app } = require ( 'electron' )
const fs = require ( 'fs' )
const path = require ( 'path' )
const sanitize = require ( 'sanitize-filename' )

const PREF_PATH = path.resolve
( app.getPath ( 'userData' ), 'Lucidity.json' )

const debug = ( ...args ) => {
  console.log ( args.join ("\n") )
}

interface FileCache {
  [ key: string ]: string | boolean
}

interface StringMap {
  [ key: string ]: string
}

interface CompInfo {
  _id: string
  type: string
  name: string
}

interface CompCache {
  info?: CompInfo
  // path to source
  files: FileCache
  // ino to path ( detect FS rename )
  inop: StringMap
  // block.id to path ( detect editor rename )
  bidp: StringMap
}

interface CompCaches {
  [ key: string ]: CompCache
}

let compCacheById: CompCaches = {}
let libCacheById: CompCaches = {}
let readCache: CompCache
let writeCache: CompCache

let projectPath: string
let libraryPath = '/Users/gaspard/git/lucidity.library/components'

export const start = ( win ) => {

  ipcMain.on ( 'open-project', ( event ) => {
    // User can choose a project
    // Not implemented yet
  })

  ipcMain.on ( 'load-project', loadProject )
  ipcMain.on ( 'load-library', loadLibrary )
  ipcMain.on ( 'load-components', loadComponents )

  ipcMain.on ( 'select-project-path', ( event ) => {
    // New project or web project open in electron for the first time.
    dialog.showOpenDialog
    ( win
    , { properties: [ 'openDirectory', 'createDirectory' ]
      , title: `Please select a folder for the project.`
      }
    , function ( paths ) {
        event.sender.send ( 'project-path-selected', paths [ 0 ] )
      }
    )
  })

  ipcMain.on ( 'select-library-path', ( event ) => {
    // New project or web project open in electron for the first time.
    dialog.showOpenDialog
    ( win
    , { properties: [ 'openDirectory', 'createDirectory' ]
      , title: `Please select a directory to store the library.`
      }
    , function ( paths ) {
        event.sender.send ( 'library-path-selected', paths [ 0 ] )
      }
    )
  })

  ipcMain.on
  ( 'component-changed'
  , ( event, component: ComponentType ) => {
      if ( !libraryPath ) {
        return
      }
      debug ( '', '[comp. ] ' + component.name )
      try {
        saveComponent
        ( [ libraryPath ]
        , component
        , compCacheById
        )
        event.sender.send ( 'done' )
        debug ( '[comp. ] done !' )
      }
      catch ( err ) {
        console.log ( err )
        event.sender.send ( 'error', err.message )
      }
    }
  )

  ipcMain.on
  ( 'project-changed'
  , ( event, project: ComponentType ) => {
      // project graph
      if ( !projectPath ) {
        return
      }
      debug ( '', '[proj. ] ' + project.name )
      try {
        saveComponent
        ( [ projectPath ]
        , project
        , compCacheById
        )
        event.sender.send ( 'done' )
        debug ( '[proj. ] done !' )
      }
      catch ( err ) {
        console.log ( err )
        event.sender.send ( 'error', err.message )
      }
    }
  )

  ipcMain.on
  ( 'scene-changed'
  , ( event, scene: ComponentType ) => {
      // scenes
      if ( !projectPath ) {
        return
      }
      debug ( '', '[scene ] ' + scene.name )
      try {
        saveComponent
        ( [ projectPath, 'scenes' ]
        , scene
        , compCacheById
        )
        event.sender.send ( 'done' )
        debug ( '[scene ] done !' )
      }
      catch ( err ) {
        console.log ( err )
        event.sender.send ( 'error', err.message )
      }
    }
  )

  // This communication is not async: we want to block until we get
  // the preferences.
  ipcMain.on
  ( 'preferences'
  , ( event, prefs ) => {
    if ( !prefs ) {
      const s = stat ( PREF_PATH )
      if ( !s ) {
        const prefs: PreferencesType =
        { projectPaths: {}, libraryPath: null }
        event.returnValue = prefs
      }
      else if ( s.isFile () ) {
        const source = fs.readFileSync ( PREF_PATH, 'utf8' )
        try {
          prefs = JSON.parse ( source )
          event.returnValue = prefs
        }
        catch ( err ) {
          console.log ( err )
          event.sender.send ( 'error', err )
        }
      }
      else {
        event.sender.send
        ( 'error', `ERROR: file preferences '${PREF_PATH}' is not a file.` )
      }
    }
    else {
      fs.writeFile ( PREF_PATH, JSON.stringify ( prefs, null, 2 ) )
    }
  })
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

const saveComponent =
( paths: string[]
, comp: ComponentType
, caches: CompCaches
, loading?: boolean
) => {
  const cache = caches [ comp._id ]
  const saveOp = loading ? loadFile : saveFile
  // prepare path
  writeCache = { files: {}, inop: {}, bidp: {} }
  let basepath = paths [ 0 ]
  for ( let i = 1; i < paths.length; ++i ) {
    basepath = makeFolder ( basepath, paths [ i ] )
  }

  if ( !cache ) {
    const cache: CompCache = { info: comp, files: {}, inop: {}, bidp: {} }
    readCache = cache
    writeCache = cache
    exportDoc ( comp, basepath, saveOp, makeFolder )
    caches [ comp._id ] = cache
  }
  else {
    const info = cache.info
    if ( info.name !== comp.name ) {
      // move file
      rename
      ( basepath
      , `${info.name}.lucy`
      , `${comp.name}.lucy`
      , cache
      )
      // move folder
      rename
      ( basepath
      , info.name
      , comp.name
      , cache
      )
    }

    readCache = cache
    writeCache = Object.assign ( {}, readCache, { files: {} } )
    exportDoc ( comp, basepath, saveOp, makeFolder )

    // we must remove unused files.
    // longest paths first
    const keys = Object.keys ( readCache.files ).sort ( ( a, b ) => a < b ? 1 : -1 )
    for ( const p of keys ) {
      if ( writeCache.files [ p ] === undefined ) {
        // remove old file
        const s = stat ( p )
        if ( !s ) {
          // noop
        } else if ( s.isFile () ) {
          fs.unlinkSync ( p )
          // clear inop
          delete writeCache.inop [ fileid ( s ) ]
          debug ( '[remove] ' + p )
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
    // Clear bidp
    const oldbid = []
    const blocksById = comp.graph.blocksById
    const bidp = cache.bidp
    for ( const k in bidp ) {
      if ( !blocksById [ k ] ) {
        delete bidp [ k ]
      }
    }

    cache.info = comp
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
    debug ( '[same  ] ' + p )
    return
  }

  const s = stat ( p )
  if ( !s || s.isFile () ) {
    const olds = oldp ? readCache.files [ oldp ] : null
    const oldf = oldp ? stat ( oldp ) : null
    if ( !c && oldf && olds === source ) {
      // move (path not in cache but known previous path)
      fs.renameSync ( oldp, p )
      debug ( '[move  ] ' + oldp + '-->' + p )
    }
    else {
      // changed file
      fs.writeFileSync ( p, source, 'utf8' )
      debug ( '[write ] ' + p )
    }

    writeCache.bidp [ blockId ] = p
    writeCache.files [ p ] = source
    const s = stat ( p )
    writeCache.inop [ fileid ( s ) ] = p
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
    debug ( '[mkdir ] ' + p )
  }
  else if ( !s.isDirectory () ) {
    // error
    throw `Cannot save graph to '${p}' (not a folder).`
  }
  writeCache.files [ p ] = true
  return p
}

const loadFile =
( base: string, name: string, source: string, blockId: string ): void => {
  const p = path.resolve ( base, sanitize ( name ) )
  writeCache.files [ p ] = source
  writeCache.bidp [ blockId ] = p

  let s = stat ( p )
  if ( !s ) {
    fs.writeFileSync ( p, source, 'utf8' )
    debug ( '[write ] ' + p )
    s = stat ( p )
  } else if ( s.isFile () ) {
    debug ( '[load  ] ' + p )
    // do not overwrite file system (considered as holding truth)
  }
  else {
    // not a file
    throw `Cannot save graph source to '${p}' (not a file).`
  }
  writeCache.inop [ fileid ( s ) ] = p
}

let libWatcher

const loadLibrary =
( event: any
, apath: string
) => {
  const basepath = path.resolve ( apath )
  const sender = event.sender
  libraryPath = basepath
  // clear cache
  libCacheById = {}

  // clear old watcher
  if ( libWatcher ) {
    libWatcher.close ()
  }
  sender.send ( 'done' )
}

const loadComponents =
( event: any
, components: ComponentType[]
) => {
  const sender = event.sender
  if ( components ) {
    // Lock write and record all paths
    try {
      for ( const comp of components ) {
        saveComponent
        ( [ libraryPath ]
        , comp
        , libCacheById
        , true // nowrite
        )
      }
    }
    catch ( err ) {
      console.log ( err )
      sender.send ( 'error', err.message )
    }
  }
  else {
    // Parse all paths and simulate 'path changed' to move new
    // content in app.

    const children = fs.readdirSync ( libraryPath )
    for ( const child of children ) {
      const p = path.resolve ( libraryPath, child )
      const s = stat ( p )
      if ( !s ) { continue }
      if ( s.isFile () ) {
        if ( tsRe.test ( p ) ) {
          handleEvent
          ( libraryPath, sender, libCacheById, 'library-changed', child )
        }
      }
      else if ( s.isDirectory () ) {
        // FIXME deal with more complex components...
        // test if exist in cache, ...
      }
    }

    // watch new path
    libWatcher = fs.watch
    ( libraryPath
    , { persistent: true
      , recursive: true // FIXME: not avail on linux. We need to add each file..
      }
    , ( event, filename ) => {
        handleEvent ( libraryPath, sender, libCacheById, 'library-changed', filename )
      }
    )
  }

  sender.send ( 'done' )
}

let projectWatcher

const loadProject =
( event: any
, project: ComponentType
, scenes: ComponentType[]
, apath: string
) => {
  const basepath = path.resolve ( apath )
  const sender = event.sender
  projectPath = basepath
  // clear cache
  compCacheById = {}

  // clear old watcher
  if ( projectWatcher ) {
    projectWatcher.close ()
  }
  if ( !basepath ) {
    // stop sync
    return
  }

  // Lock write and record all paths
  try {
    saveComponent
    ( [ projectPath ]
    , project
    , compCacheById
    , true // nowrite
    )
    for ( const comp of scenes ) {
      saveComponent
      ( [ projectPath, 'scenes' ]
      , comp
      , compCacheById
      , true // nowrite
      )
    }
  }
  catch ( err ) {
    console.log ( err )
    sender.send ( 'error', err.message )
  }

  // Parse all paths and simulate 'path changed' to move new
  // content in app.
  traverse
  ( basepath
  , null
  , ( filename ) => {
      handleEvent ( basepath, sender, compCacheById, 'file-changed', filename )
    }
  )

  // watch new path
  projectWatcher = fs.watch
  ( basepath
  , { persistent: true
    , recursive: true // FIXME: not avail on linux. We need to add each file..
    }
  , ( event, filename ) => {
      handleEvent ( basepath, sender, compCacheById, 'file-changed', filename )
    }
  )

  sender.send ( 'done' )
}

const tsRe = /\.ts$/

const traverse =
( basepath: string
, filename: string
, callback
) => {
  const p = filename ? path.resolve ( basepath, filename ) : basepath
  const s = stat ( p )
  if ( !s ) { return }
  if ( s.isFile () ) {
    if ( tsRe.test ( p ) && filename ) {
      callback ( filename )
    }
  } else if ( s.isDirectory () ) {
    const children = fs.readdirSync ( p )
    for ( const child of children ) {
      const subp = filename ? path.join ( filename, child ) : child
      traverse ( basepath, subp, callback )
    }
  }
}

interface Stat {
  ctime: Date
  ino: any
  size: number
}

const fileid =
( s: Stat ) => {
  return String ( s.ino )
}

interface Sender {
  send ( ...any ): void
}

const handleEvent =
( basepath: string
, sender: Sender
, caches: CompCaches
, eventType: 'file-changed' | 'library-changed'
, filename: string
) => {
  const p = path.resolve ( basepath, filename )
  const s = stat ( p )
  if ( !s || !s.isFile () ) {
    // ignore
    return
  }
  let cache, source, oldp
  const ino = fileid ( s )

  // Do we know this file ?
  for ( const k in caches ) {
    cache = caches [ k ]
    source = cache.files [ p ]
    if ( source !== undefined ) {
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
    const info = cache.info
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
    { ownerType: info.type
    , _id: info._id
    , path: oldp.substr ( basepath.length + 1 )
    , op: 'rename'
    , name: filename.split ( '/' ).pop ()
    }
    debug ( '[fs.nam]', filename, oldp )
    sender.send ( eventType, msg )
  }
  else if ( source !== undefined ) {
    const src = fs.readFileSync ( p, 'utf8' )
    if ( source === src ) {
      // noop
    }

    else {
      // changed
      const info = cache.info
      cache.files [ p ] = source
      const msg: FileChanged =
      { ownerType: info.type
      , _id: info._id
      , path: filename
      , op: 'changed'
      , source: src
      }
      debug ( '[fs.mod] ' + filename )
      sender.send ( eventType, msg )
    }
  }

  else if ( eventType === 'library-changed' ){
    const src = fs.readFileSync ( p, 'utf8' )
    const msg: FileChanged =
    { ownerType: 'component'
    , _id: null
    , path: filename
    , op: 'changed'
    , source: src
    }
    debug ( '[fs.new] ' + filename )
    sender.send ( eventType, msg )
  }

  else {
    debug ( '[ignore] ' + p )
  }
  // if filename === path, (moved)
  // we must call selectProjectPath to
  // recreate watch.
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
    debug ( '[rename] ' + from + ' --> ' + to )
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
    debug ( '[rename] ' + from + ' --> ' + to )
  }
}
