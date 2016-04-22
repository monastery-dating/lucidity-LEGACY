export interface UIPosType {
  x: number
  y: number
}

export interface UIBoxSize {
  // used to skip computation if name did not change
  cacheName: string
  w: number
  h: number
  tx: number // text position x
  ty: number // and y
  wd: number
  wu: number
  ds: number
  us: number
  wde: number
}

export interface UIBoxType {
  type?: string
  name: string
  id: string
  size: UIBoxSize
  pos: UIPosType
  sextra: number[]

  // can contain more then one class ( for ghost element )
  className: string
  // draw path
  path: string
  // slot paths
  slots: string[]
}
