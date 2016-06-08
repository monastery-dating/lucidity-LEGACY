// Type definitions for [LIBRARY NAME]
// Project: [LIBRARY URL]
// Definitions by: [AUTHOR NAME] <[AUTHOR URL]>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

declare module 'jszip' {
  interface JSZip {
    (): void
    file ( name: string, data: string, opts: any ): void
    folder ( name: string ): JSZip
    generateAsync ( opts?: any )
  }
  const dummy: JSZip
  export = dummy
}
