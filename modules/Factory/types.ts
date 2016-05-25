type stringArray = string[]
export interface FactorySignalsType {
  set ( { path: stringArray, value: any } )
  add ( { path: stringArray, type: string } )
  finishedEditing ( { path: stringArray, value: any } )
  // TODO: rename reloaded or attached or ...
}

interface DocumentType {
  _id: string
  _rev?: string
  type: string
  [ key: string ]: any
}

export interface FactoryCreateHelperType {
  ( opts: { _id: string, type: string } ): DocumentType[]
}
