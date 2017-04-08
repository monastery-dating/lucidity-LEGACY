
declare module '@hoodie/store-client' {
  interface Store {
    ( dbname: string, options: any ): void
  }

  const dummy: Store
  export = dummy
}
