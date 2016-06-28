// FileStorageHelper runs on the window process.
// This helper runs on the main process.
import { ProjectType } from '../../Project/ProjectType'
import { SceneType } from '../../Scene/SceneType'
import { exportGraph } from '../../Graph/helper/GraphParser'

declare var require: any
const { ipcMain, dialog } = require ( 'electron' )
const fs = require ( 'fs' )
const path = require ( 'path' )
const sanitize = require ( 'sanitize-filename' )

interface FileCache {
  [ key: string ]: string | boolean
}

interface SceneCache {
  scene: SceneType
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

  ipcMain.on ( 'open-project', () => {
    // TODO
  })

  ipcMain.on
  ( 'project-changed'
  , ( event, project: ProjectType ) => {
      // scenes
      const err = updateGraph
      ( [ projectPath ]
      , project
      , sceneCacheById [ project._id ]
      )
      if ( err ) {
        event.sender.send ( 'error', err )
        return
      }

      const p = path.resolve ( projectPath, `${ sanitize ( project.name ) }.lucy` )
      const doc = Object.assign ( {}, project )
      delete doc.graph
      delete doc.scenes
      const json = JSON.stringify ( doc, null, 2 )

      if ( json === projectCache.json ) {
        // no change
      }
      else {
        fs.writeFile ( p, json, 'utf8', ( err ) => {
          if ( err ) {
            console.log ( err )
          }
        })
        projectCache.json = json
      }

      if ( projectCache.name !== project.name ) {
        // remove old file
        const p = path.resolve ( projectPath, `${ sanitize ( projectCache.name ) }.lucy` )
        const f = stat ( p )
        if ( f && f.isFile () ) {
          fs.unlink ( p, ( err ) => {
            if ( err ) {
              console.log ( err )
            }
          })
        }
      }
      projectCache.name = doc.name
    }
  )

  ipcMain.on
  ( 'scene-changed'
  , ( event, scene: SceneType ) => {
      // scenes
      const err = updateGraph
      ( [ projectPath, 'scenes' ]
      , scene
      , sceneCacheById [ scene._id ]
      )
      if ( err ) {
        event.sender.send ( 'error', err )
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
, scene: SceneType | ProjectType
, cache: SceneCache
): string => {
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
    const err = createGraph ( basepath, scene )
    if ( !err ) {
      sceneCacheById [ scene._id ] = cache
    }

    return err
  }
  else {
    const oscene = cache.scene
    if ( oscene.name !== scene.name ) {
      // rename: move folder
      const from = path.resolve ( basepath, sanitize ( oscene.name ) )
      const to = path.resolve ( basepath, sanitize ( scene.name ) )
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
    }

    readCache = cache.files
    writeCache = {}
    const err = createGraph ( basepath, scene )
    if ( err ) {
      // TODO: should we restore files ?
    }
    else {
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

const createGraph =
( basepath: string
, scene: SceneType
): string => {
  try {
    const base = makeFolder ( basepath, scene.name )
    exportGraph ( scene.graph, base, saveFile, makeFolder )
    return null
  }
  catch ( err ) {
    return err.message
  }
}
