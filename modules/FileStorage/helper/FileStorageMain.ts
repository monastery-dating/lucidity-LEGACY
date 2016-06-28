// FileStorageHelper runs on the window process.
// This helper runs on the main process.
import { ComponentType } from '../../Graph/types/ComponentType'
import { exportDoc } from '../../Graph/helper/GraphParser'

declare var require: any
const { ipcMain, dialog } = require ( 'electron' )
const fs = require ( 'fs' )
const path = require ( 'path' )
const sanitize = require ( 'sanitize-filename' )

interface FileCache {
  [ key: string ]: string | boolean
}

interface SceneCache {
  scene: ComponentType
  files: FileCache
}

interface SceneCaches {
  [ key: string ]: SceneCache
}

const sceneCacheById: SceneCaches = {}
let readCache: FileCache
let writeCache: FileCache

// Latest project and scene saved to fs
const projectCache = { json: '', name: '' }

// User selected project and library paths
// FIXME !!! "open project" and "select library" (where is default lib path ?)
let projectPath = '/Users/gaspard/git/lucidity.project'
let libraryPath = '/Users/gaspard/git/lucidity.library/components'

export const start = () => {

  ipcMain.on ( 'select-project', () => {
    // TODO
    // Must select a ".lucy" file
    // and reply with 'selected-directory'
    // selectedProjectPath ( path )
  })

  ipcMain.on ( 'select-directory', () => {
    // TODO
    // This is used when someone creates a new project
    // Must select a folder and reply with 'selected-directory'
    // selectedProjectPath ( path )
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
  writeCache = {}
  let basepath = paths [ 0 ]
  for ( let i = 1; i < paths.length; ++i ) {
    basepath = makeFolder ( basepath, paths [ i ] )
  }

  if ( !cache ) {
    const cache: SceneCache = { scene, files: {} }
    readCache = cache.files
    writeCache = cache.files
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

    readCache = cache.files
    writeCache = {}
    exportDoc ( scene, basepath, saveFile, makeFolder )

    // we must remove unused files.
    // longest paths first
    const keys = Object.keys ( readCache ).sort ( ( a, b ) => a < b ? 1 : -1 )
    for ( const p of keys ) {
      if ( ! writeCache [ p ] ) {
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
    cache.files = writeCache
  }
}

const saveFile =
( base: string, name: string, source: string /*, uuid */ ): void => {
  const p = path.resolve ( base, sanitize ( name ) )
  const c = readCache [ p ]
  // TODO: optimize to use small uuid as third argument to detect block change
  if ( c === source ) {
    // not changed
    writeCache [ p ] = source
    return
  }
  const s = stat ( p )
  if ( !s || s.isFile () ) {
    // changed file
    fs.writeFileSync ( p, source, 'utf8' )
    console.log ( '[write ] ' + p )
  }
  else {
    // not a file
    throw `Cannot save graph source to '${p}' (not a file).`
  }
  writeCache [ p ] = source
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
  writeCache [ p ] = true
  return p
}

const selectedProjectPath =
( path: string ) => {
  projectPath = path
  // clear cache
  // push scenes into db with importDoc ==> doc
  // push project content into db
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
    cache.files = newCache
  }
  else if ( sfrom && sfrom.isFile () && !sto ) {
    fs.renameSync ( from, to )
    console.log ( '[rename] ' + from + ' --> ' + to )
  }
}
