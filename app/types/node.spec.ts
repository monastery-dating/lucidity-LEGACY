/// <reference path="../../typings/jasmine/jasmine.d.ts" />
import { NodeType } from './node.type'
import * as Node from './node.helper'

const basePath = '/some/place'

describe
( 'Node.create', () => {
    let node : NodeType
    beforeEach
    ( () => {
        node = Node.create ( 'hello' , SOURCE_A, basePath )
      }
    )
    it ( 'should set name', () => {
        expect ( node.name )
        .toEqual ( 'hello' )
      }
    )
    it ( 'should set source', () => {
        expect ( node.source )
        .toEqual ( SOURCE_A )
      }
    )
    it ( 'should compute path', () => {
        expect ( node.path )
        .toEqual ( `${basePath}/hello.ts`)
      }
    )
    it ( 'should be immutable', () => {
        expect
        ( function () {
          node.name = 'foobar'
          }
        )
        .toThrow ()
      }
    )
    xit ( 'should parse source', () => {
        expect ( node.input )
        .toEqual ( [ 'text:string', 'text:string' ] )
        expect ( node.output )
        .toEqual ( 'text:string' )
        expect ( node.init )
        .toBe ( false )
      }
    )
  }
)

describe
( 'Node.update', () => {
    let node : NodeType
    beforeEach
    ( () => {
        node = Node.create ( 'hello' , SOURCE_A, basePath )
      }
    )
    it ( 'should set name', () => {
        const node2 = Node.update ( node, { name: 'new name' } )
        expect ( node.name )
        .toEqual ( 'hello' )
      }
    )
    it ( 'should set source', () => {
        expect ( node.source )
        .toEqual ( SOURCE_A )
      }
    )
    it ( 'should compute path', () => {
        expect ( node.path )
        .toEqual ( `${basePath}/hello.ts`)
      }
    )
    xit ( 'should parse source', () => {
        expect ( node.input )
        .toEqual ( [ 'text:string', 'text:string' ] )
        expect ( node.output )
        .toEqual ( 'text:string' )
        expect ( node.init )
        .toBe ( false )
      }
    )
  }
)

// ============================================= Source code for testing
const SOURCE_A = ``
