// Type definitions for [LIBRARY NAME]
// Project: [LIBRARY URL]
// Definitions by: [AUTHOR NAME] <[AUTHOR URL]>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

declare module 'uuid' {
  interface Uuid {
    (): string
  }
  const dummy: Uuid
  export = dummy
}
