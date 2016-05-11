interface AllDocsOpts {
  include_docs?: Boolean
  descending?: Boolean
}

interface DocResult {
  rows: any[]
}

interface AllCallback {
  ( err: string, doc: DocResult )
}

interface Callback<T> {
  ( err: string, res: T )
}

interface DbType<T> {
  allDocs<T> ( opts: AllDocsOpts, clbk: AllCallback ): void
  put<T> ( doc: T, clbk: Callback<T> ): void
}

export type Db = DbType<any>
