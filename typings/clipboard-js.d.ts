

declare module 'clipboard-js' {
  interface Clipboard {
    copy ( text: string ): any
    copy
    ( opts: { 'text/plain': string, 'text/html': string }
    ): any
  }
  const module: Clipboard
  export = module
}