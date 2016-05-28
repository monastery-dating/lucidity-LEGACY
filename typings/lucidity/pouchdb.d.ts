// Type definitions for [LIBRARY NAME]
// Project: [LIBRARY URL]
// Definitions by: [AUTHOR NAME] <[AUTHOR URL]>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

interface PouchDBPlugin {
  pouchdbPlugin: any
}

declare module 'pouchdb' {
  interface PouchDB {
    ( dbname: string, opts?:any ): void
    plugin ( PouchDBPlugin )
  }
  const dummy: PouchDB
  export = dummy
}

declare module 'pouchdb-authentication' {
  const dummy: PouchDBPlugin
  export = dummy
}
