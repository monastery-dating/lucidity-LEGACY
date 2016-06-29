
export interface FileChanged {
  ownerType: string
  _id: string
  path: string
  op: string
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
