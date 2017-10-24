
export interface FileChanged {
  type: string
  _id: string
  op: string
  // extra sources file name
  sourceName?: string
  blockId?: string
  source?: string
  name?: string
}

interface StringMap {
  [ key: string ]: string
}

export interface PreferencesType {
  projectPaths: StringMap // project._id ==> abs path on user machine
  libraryPath: string
}
