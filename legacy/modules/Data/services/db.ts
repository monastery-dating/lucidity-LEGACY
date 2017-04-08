import * as PouchDB from 'pouchdb'
import * as PouchDBAuthentication from 'pouchdb-authentication'

// https://github.com/nolanlawson/pouchdb-authentication
PouchDB.plugin ( PouchDBAuthentication )

export const db = new PouchDB ( 'lucidity' )
