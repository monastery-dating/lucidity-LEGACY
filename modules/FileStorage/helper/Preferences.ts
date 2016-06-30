import { PreferencesType } from './types'
import { resolve, stat, readFileSync, writeFile } from './FileStorageUtils'
declare var require: any
const { app } = require ( 'electron' )

const PREF_PATH = resolve
( app.getPath ( 'userData' ), 'Lucidity.json' )

export const preferences =
( event
, prefs: PreferencesType
) => {
  const sender = event.sender
  if ( !prefs ) {
    const s = stat ( PREF_PATH )
    if ( !s ) {
      const prefs: PreferencesType =
      { projectPaths: {}, libraryPath: null }
      event.returnValue = prefs
    }
    else if ( s.isFile () ) {
      const source = readFileSync ( PREF_PATH, 'utf8' )
      try {
        prefs = JSON.parse ( source )
        event.returnValue = prefs
      }
      catch ( err ) {
        console.log ( err )
        sender.send ( 'error', err )
      }
    }
    else {
      sender.send
      ( 'error', `ERROR: file preferences '${PREF_PATH}' is not a file.` )
    }
  }
  else {
    writeFile ( PREF_PATH, JSON.stringify ( prefs, null, 2 ) )
  }
}
