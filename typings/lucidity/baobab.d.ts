
declare module 'baobab' {
  interface Baobab {
    ( initState: Object ): void
    get (): any
  }
  const dummy: Baobab
  export = dummy
}
