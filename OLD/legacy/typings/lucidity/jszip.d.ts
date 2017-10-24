// Type definitions for [LIBRARY NAME]
// Project: [LIBRARY URL]
// Definitions by: [AUTHOR NAME] <[AUTHOR URL]>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

declare module 'jszip' {
  interface JSZip {
    file ( name: string, data: string, opts: any ): void
    folder ( name: string ): JSZip
    generateAsync ( opts?: any )
  }

  interface JSZipConstructor {
    new (): JSZip
  }
  const module: JSZipConstructor
  export = module
}
