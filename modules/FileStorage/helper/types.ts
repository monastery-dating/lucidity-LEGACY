
export interface FileChanged {
  ownerType: string
  _id: string
  path: string
  op: string
  source?: string
  name?: string
}
