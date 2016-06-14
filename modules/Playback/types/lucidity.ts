import { midi } from './midi'

type ContextExtension = any

interface MainContext {
  midi: midi.State
}

type Cache = any

type Context = MainContext & ContextExtension

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

export interface Helpers {
  // optional to ease testing
  context?: Context
  cache?: Cache
  children?: Children
  detached?: boolean
  require?: Require
}

interface ContextType {
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
  expect?: ContextType
  provide?: ContextType
  children?: string[] | 'all'
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
