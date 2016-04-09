export interface UIPosType {
  x: number
  y: number
}

export interface UIBoxSize {
  // used to skip computation if name did not change
  cacheName: string
  w: number
  h: number
  wd: number
  wu: number
  ds: number
  us: number
  wde: number
}

export interface UIBoxType {
  name: string
  id: string
  size: UIBoxSize
  pos: UIPosType
  sextra: number[]

  // final computed elements
  className: string
  // draw path
  path: string
  // slot paths
  slots: string[]
}
