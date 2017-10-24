import { PreferencesType } from './types'
declare var require: any
declare var nw: any

let PREF_PATH, resolve, stat, readFileSync, writeFile

let doPreferences =
( prefs: PreferencesType
): PreferencesType => {
  // Not needed outside NW.js
  return null
}

if ( window [ 'process' ] ) {
  // in NW.js. Abort
  const fs = require ( 'fs' )
  const path = require ( 'path' )
  readFileSync = fs.readFileSync
  resolve = path.resolve
  stat = ( path ) => {
    try {
      return fs.statSync ( path )
    }
    catch ( err ) {
      return null
    }
  }
  writeFile = fs.writeFile

  PREF_PATH = resolve
  ( nw.App.dataPath, '..', 'Lucidity.json' )
  doPreferences =
  ( prefs: PreferencesType ) => {
    if ( !prefs ) {
      const s = stat ( PREF_PATH )
      if ( !s ) {
        const prefs: PreferencesType =
        { projectPaths: {}, libraryPath: null }
        return prefs
      }
      else if ( s.isFile () ) {
        const source = readFileSync ( PREF_PATH, 'utf8' )
        return JSON.parse ( source )
      }
      else {
        throw `File preferences '${PREF_PATH}' is not a file.`
      }
    }
    else {
      writeFile ( PREF_PATH, JSON.stringify ( prefs, null, 2 ) )
      return prefs
    }
  }
}

// This is not called when not in
export const preferences =
( prefs: PreferencesType
): PreferencesType => {
  return doPreferences ( prefs )
}
