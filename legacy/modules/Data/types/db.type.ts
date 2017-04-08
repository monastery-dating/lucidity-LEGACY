interface AllDocsOpts {
  include_docs?: Boolean
  descending?: Boolean
}

interface DocResult {
  rows: any[]
}

interface DBError {
  status: number
  name: string
  message: string
  error: boolean
}

interface AllCallback {
  ( err: DBError, doc: DocResult )
}

interface Callback<T> {
  ( err: DBError, res: T )
}

// we make functions optional for mock in testing
interface DbType<T> {
  allDocs?<T> ( opts: AllDocsOpts, clbk: AllCallback ): void
  bulkDocs? ( docs: T[], clbk: Callback<T> )
  put?<T> ( doc: T, clbk: Callback<T> ): void
}

export type Db = DbType<any>

export interface AuthDBType {
  signup ( name: string, password: string, meta?: any ): Promise<any>
  login ( name: string, password: string ): Promise<any>
  logout (): Promise<any>
}
