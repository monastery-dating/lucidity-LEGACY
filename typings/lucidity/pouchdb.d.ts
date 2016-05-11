// Type definitions for [LIBRARY NAME]
// Project: [LIBRARY URL]
// Definitions by: [AUTHOR NAME] <[AUTHOR URL]>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

declare module 'pouchdb' {
  interface PouchDB {
    ( dbname: string ): void
  }

  const dummy: PouchDB
  export = dummy
}
