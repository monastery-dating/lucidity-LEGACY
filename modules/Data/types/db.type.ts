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

// we make functions optional for mock in testing
interface DbType<T> {
  allDocs?<T> ( opts: AllDocsOpts, clbk: AllCallback ): void
  bulkDocs? ( docs: T[], clbk: Callback<T> )
  put?<T> ( doc: T, clbk: Callback<T> ): void
}

export type Db = DbType<any>
