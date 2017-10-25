
declare module 'base64-arraybuffer' {
  interface Base64 {
    decode ( base64: string ): ArrayBuffer
    encode ( buffer: ArrayBuffer ): string
  }
  const module: Base64
  export = module
}
