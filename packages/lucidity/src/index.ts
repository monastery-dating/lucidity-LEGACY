export type ContextExtension = any

/* ********** CONTEXTUAL TYPES ********** */
export interface Time {
  now: number // [s]
  dt: number  // [s]
}

// velocity values from 0-127
export type Note = number[]
// velocity values from 0-127
export type Ctrl = number[]

export interface Midi {
  note: Note [] // notes per channel 1-16
  ctrl: Ctrl [] // ctrl per channel 1-16
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

export interface MainContext {
  midi: Midi
}

export type Cache = any

// TODO: Try to augment this contect during type checking of Block depending
// on context requirements, meta.expect field.
export type Context = Readonly < MainContext & ContextExtension >

export interface AllChildren {
  (): void
}

export interface Children {
  [ key: number ]: Update
  // This only exists if the Meta.children is 'all'
  all?: AllChildren
}

export interface Require {
  ( libname: string ): any
}

export interface SourceCallback {
  ( content: string ): void
}

export interface Asset {
  source ( name: string, callback: SourceCallback ): void
}

export interface SliderCallback {
  ( v: number ): void
}

export interface PadCallback {
  ( x: number, y: number ): void
}

export interface Control {
  Slider ( name: string, clbk: SliderCallback )
  Pad ( namex: string, namey: string, clbk: PadCallback )
}

export interface Helpers {
  context: Context
  // control: Control
  // require: Require
  // asset: Asset
  children: Children
  cache: Cache
  detached: boolean
  // Not to be used inside a Block
  contextForChildren: Context;
}

export interface StringMap {
  [ key: string ]: string
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
  // If there is an update function but no type information, it
  // is considered a floating child and can be conected to any slot.
  update?: string
}

export interface Init {
  ( h: Helpers ): ContextExtension | void
}

export interface Update {
  ( ... any ): any
}

export interface Block {
  init?: Init
  update?: Update
  meta?: Meta
}
