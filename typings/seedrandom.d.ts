// Type definitions for [LIBRARY NAME]
// Project: [LIBRARY URL]
// Definitions by: [AUTHOR NAME] <[AUTHOR URL]>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

declare module 'seedrandom' {
  interface IRandom {
    (): number
  }

  interface ISeedrandom {
    ( seed: string ): IRandom
    ( seed: number ): IRandom
  }
  const dummy: ISeedrandom
  export = dummy
}
