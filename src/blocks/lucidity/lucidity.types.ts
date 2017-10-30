type ContextExtension = any

/* ********** CONTEXTUAL TYPES ********** */
export interface Time {
  now: number // [s]
  dt: number  // [s]
}

// velocity values from 0-127
type Note = number[]
// velocity values from 0-127
type Ctrl = number[]

export interface Midi {
  note: Note[] // notes per channel 1-16
  ctrl: Ctrl[] // ctrl per channel 1-16
}

export interface Screen {
  width: number  // [px]
  height: number // [px]
  top: number    // [px]
  bottom: number // [px]
  left: number   // [px]
  right: number  // [px]
}

/* ********* */

interface MainContext {
  midi: Midi
}

type Cache = any

// TODO: Try to augment this contect during type checking of Block depending
// on context requirements, meta.expect field.
export type Context = MainContext & ContextExtension

interface AllChildren {
  (): void
}

interface Children {
  [ key: number ]: Update
  all?: AllChildren
}

interface Require {
  ( libname: string ): any
}

interface SourceCallback {
  ( content: string ): void
}

interface Asset {
  source ( name: string, callback: SourceCallback ): void
}

export interface SliderCallback {
  ( v: number ): void
}

export interface PadCallback {
  ( x: number, y: number ): void
}

export interface Control {
  Slider ( name: string, clbk: SliderCallback ): void
  Pad ( namex: string, namey: string, clbk: PadCallback ): void
}

export interface Helpers {
  asset?: Asset
  cache: Cache
  children: Children
  context: Context
  contextForChildren: Context
  control?: Control
  detached?: boolean
  require?: Require
}

export interface StringMap <T=string> {
  [ key: string ]: T
}

export interface Meta {
  // only mandatory in the official library
  description: string
  tags: string[]
  author: string
  origin: string
  version: string
  // end mandatory
  expect?: StringMap
  provide?: StringMap
  children?: string[] | 'all'
  update?: string
}

export interface Init {
  ( h: Helpers ): ContextExtension | void
}

export interface Update {
  ( ... arg: any [] ): any
}

export interface Block {
  init?: Init
  update?: Update
  meta?: Meta
}
