import { ComponentType } from '../../Graph/types/ComponentType'
import { buildCache, CacheType, clearCache, stat, resolve, mkdirSync, sanitize } from './FileStorageUtils'
import { watchPath, Watcher } from './watchPath'
import { updateFiles, saveLucidityJson } from './updateFiles'

const projectCache = clearCache ( {} )
let projectPath

interface CacheById {
  [ key: string ]: CacheType
}

const sceneCacheById: CacheById = {}

export const loadProject =
( event
, path: string
, project: ComponentType
, scenes: ComponentType[]
) => {
  const sender = event.sender
  projectPath = path
  const root = resolve ( path, 'project' )
  loadScene ( root, project, projectCache, sender )

  const scenesPath = resolve ( path, 'scenes' )
  const s = stat ( scenesPath )
  if ( !s ) {
    mkdirSync ( scenesPath )
  }

  for ( const k in sceneCacheById ) {
    const cache = sceneCacheById [ k ]
    clearCache ( cache )
    delete sceneCacheById [ k ]
  }

  for ( const scene of scenes ) {
    const root = resolve ( scenesPath, sanitize ( scene.name ) )
    const cache = sceneCacheById [ scene._id ] = clearCache ( {} )
    loadScene ( root, scene, cache, sender )
  }
}

const loadScene =
( path: string
, comp: ComponentType
, cache: CacheType
, sender
) => {
  const s = stat ( path )
  if ( !s ) {
    mkdirSync ( path )
  }
  clearCache ( cache )
  cache.path = path
  buildCache ( path, cache )
  updateFiles ( path, cache, comp, sender )
  saveLucidityJson ( path, cache, comp, sender )
  cache.watcher = watchPath
  ( path
  , comp
  , cache
  , 'file-changed'
  , sender
  , cache.watcher
  )
}

export const projectChanged =
( event
, comp: ComponentType
) => {
  const cache = projectCache
  const path = projectCache.path
  // app changes take over FS cache
  updateFiles ( path, cache, comp, event.sender, true )
  saveLucidityJson ( path, cache, comp, event.sender )
}

export const sceneChanged =
( event
, comp: ComponentType
) => {
  let cache = sceneCacheById [ comp._id ]
  if ( !cache ) {
    cache = clearCache ( {} )
    sceneCacheById [ comp._id ] = cache
    cache.path = resolve ( projectPath, 'scenes', sanitize ( comp.name ) )
  }
  const path = cache.path
  // app changes take over FS cache
  updateFiles ( path, cache, comp, event.sender, true )
  saveLucidityJson ( path, cache, comp, event.sender )
}
